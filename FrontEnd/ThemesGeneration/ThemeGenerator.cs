using CodeGeneration.Css;

namespace FrontEnd;

public class ThemeGenerator
{
    /// <summary>
    /// The text color of the body of the page/component
    /// </summary>
    public static readonly string ColorPrimary1 = "--gcs-color-primary-1";

    /// <summary>
    /// The background color of the body of the page/component
    /// </summary>
    public static readonly string BackgroundColorPrimary1 = "--gcs-bg-color-primary-1";

    /// <summary>
    /// The text color of the subheader/toolbar/navigation item
    /// </summary>
    public static readonly string ColorPrimary2 = "--gcs-color-primary-2";

    /// <summary>
    /// The background color of the body of the subheader/toolbar/navigation item
    /// </summary>
    public static readonly string BackgroundColorPrimary2 = "--gcs-bg-color-primary-2";

    /// <summary>
    /// The text color of the header/navigation group
    /// </summary>
    public static readonly string ColorPrimary3 = "--gcs-color-primary-3";

    /// <summary>
    /// The background color of the header/navigation group
    /// </summary>
    public static readonly string BackgroundColorPrimary3 = "--gcs-bg-color-primary-3";

    /// <summary>
    /// The text color of the hover inactive
    /// </summary>
    public static readonly string ColorSecondary1 = "--gcs-color-secondary-1";

    /// <summary>
    /// The background color of the hover inactive
    /// </summary>
    public static readonly string BackgroundColorSecondary1 = "--gcs-bg-color-secondary-1";

    /// <summary>
    /// The text color of the hover active (selected) component
    /// </summary>
    public static readonly string ColorSecondary2 = "--gcs-color-secondary-2";

    /// <summary>
    /// The background color of the hover active (selected) component
    /// </summary>
    public static readonly string BackgroundColorSecondary2 = "--gcs-bg-color-secondary-2";

    /// <summary>
    /// The text color of the active (selected) component
    /// </summary>
    public static readonly string ColorTertiary1 = "--gcs-color-tertiary-1";

    /// <summary>
    /// The background color of the active (selected) component
    /// </summary>
    public static readonly string BackgroundColorTertiary1 = "--gcs-bg-color-tertiary-1";

    public string ThemeName { get; private set; }

    public short Hue { get; private set; }

    public ThemeGenerator(string themeName, short hue)
    {
        ThemeName = themeName;

        Hue = hue;
    }

    public void Generate(CssBuilder builder, ThemeGenerationStrategy strategy)
    {
        var resources = strategy.GenerateResources(Hue);

        builder.Selectors(GetThemeName(ThemeName))

            .Rule(ColorPrimary1, resources.ColorPrimary1.ToCss())
            .Rule(BackgroundColorPrimary1, resources.BackgroundColorPrimary1.ToCss())

            .Rule(ColorPrimary2, resources.ColorPrimary2.ToCss())
            .Rule(BackgroundColorPrimary2, resources.BackgroundColorPrimary2.ToCss())

            .Rule(ColorPrimary3, resources.ColorPrimary3.ToCss())
            .Rule(BackgroundColorPrimary3, resources.BackgroundColorPrimary3.ToCss())

            .Rule(ColorSecondary1, resources.ColorSecondary1.ToCss())
            .Rule(BackgroundColorSecondary1, resources.BackgroundColorSecondary1.ToCss())

            .Rule(ColorSecondary2, resources.ColorSecondary2.ToCss())
            .Rule(BackgroundColorSecondary2, resources.BackgroundColorSecondary2.ToCss())

            .Rule(ColorTertiary1, resources.ColorTertiary1.ToCss())
            .Rule(BackgroundColorTertiary1, resources.BackgroundColorTertiary1.ToCss())

        //.Rule(SurfaceShadow, GetColor(Hue, strategy.SurfaceShadowColor))
        //.Rule(ShadowStrengh, strategy.ShadowStrength)

        .End();
    }

    public string GetThemeName(string themeName)
    {
        return $@"[theme=""{themeName}""]";
    }
}