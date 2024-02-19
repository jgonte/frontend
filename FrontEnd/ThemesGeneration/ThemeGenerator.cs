using CodeGeneration.Css;

namespace FrontEnd;

public class ThemeGenerator
{
    public static readonly string TextColor = "--text-color";

    public static readonly string BackgroundColor = "--bg-color";


    public static readonly string AlternateTextColor = "--alt-text-color";

    public static readonly string AlternateBackgroundColor = "--alt-bg-color";


    public static readonly string HeaderTextColor = "--header-text-color";

    public static readonly string HeaderBackgroundColor = "--header-bg-color";


    public static readonly string HoverTextColor = "--hover-text-color";

    public static readonly string HoverBackgroundColor = "--hover-bg-color";


    public static readonly string ActiveTextColor = "--active-text-color";

    public static readonly string ActiveBackgroundColor = "--active-bg-color";


    public static readonly string ActiveHoverTextColor = "--active-hover-text-color";

    public static readonly string ActiveHoverBackgroundColor = "--active-hover-bg-color";


    public static readonly string SurfaceShadow = "--surface-shadow";

    public static readonly string ShadowStrengh = "--shadow-strength";


    public string ThemeName { get; private set; }

    public short Hue { get; private set; }

    public short AlternateHue { get; private set; }

    public ThemeGenerator(string themeName, short hue)
    {
        ThemeName = themeName;

        Hue = hue;
    }

    public void Generate(CssBuilder builder, ThemeGenerationStrategy strategy)
    {
        AlternateHue = GetAlternateHue(Hue, strategy.AlternateHueOffset);

        builder.Selectors(GetThemeName(ThemeName, strategy.ColorSchemeName))

            .Rule(TextColor, GetColor(Hue, strategy.TextColor))
            .Rule(BackgroundColor, GetColor(Hue, strategy.BackgroundColor))

            .Rule(AlternateTextColor, GetColor(Hue, strategy.AlternateTextColor))
            .Rule(AlternateBackgroundColor, GetColor(Hue, strategy.AlternateBackgroundColor))

            .Rule(HeaderTextColor, GetColor(Hue, strategy.HeaderTextColor))
            .Rule(HeaderBackgroundColor, GetColor(Hue, strategy.HeaderBackgroundColor))

            .Rule(HoverTextColor, GetColor(Hue, strategy.HoverTextColor))
            .Rule(HoverBackgroundColor, GetColor(Hue, strategy.HoverTextColor))

            .Rule(ActiveTextColor, GetColor(AlternateHue, strategy.ActiveTextColor))
            .Rule(ActiveBackgroundColor, GetColor(AlternateHue, strategy.ActiveTextColor))

            .Rule(ActiveHoverTextColor, GetColor(AlternateHue, strategy.ActiveHoverTextColor))
            .Rule(ActiveHoverBackgroundColor, GetColor(AlternateHue, strategy.ActiveHoverBackgroundColor))

            .Rule(SurfaceShadow, GetColor(Hue, strategy.SurfaceShadowColor))
            .Rule(ShadowStrengh, strategy.ShadowStrength)

        .End();
    }

    private short GetAlternateHue(short hue, short hueOffset)
    {
        return Convert.ToInt16(hue + hueOffset);
    }

    public string GetThemeName(string themeName, string colorSchemaName)
    {
        return $@"[theme=""{themeName}-{colorSchemaName}""]";
    }

    public string GetColor(short hue, PartialColorData colorData)
    {
        return new HSL(hue, colorData.Saturation, colorData.Lightness).ToCss();
    }
}