namespace FrontEnd;

public abstract class ThemeGenerationStrategy
{
    /// <summary>
    /// The suffix to add to the name of the theme
    /// </summary>
    public string ColorSchemeName { get; private set; }

    /// <summary>
    /// The hue offset to create the alternate color
    /// </summary>
    public short AlternateHueOffset { get; private set;  }

    public PartialColorData TextColor { get; private set; }

    public PartialColorData BackgroundColor { get; private set; }

    public PartialColorData AlternateTextColor { get; private set; }

    public PartialColorData AlternateBackgroundColor { get; private set; }

    public PartialColorData HeaderTextColor { get; private set; }

    public PartialColorData HeaderBackgroundColor { get; private set; }

    public PartialColorData HoverTextColor { get; private set; }

    public PartialColorData HoverBackgroundColor { get; private set; }

    public PartialColorData ActiveTextColor { get; private set; }

    public PartialColorData ActiveBackgroundColor { get; private set; }

    public PartialColorData ActiveHoverTextColor { get; private set; }

    public PartialColorData ActiveHoverBackgroundColor { get; private set; }

    public PartialColorData SurfaceShadowColor { get; private set; }

    public string ShadowStrength { get; private set; }

    public ThemeGenerationStrategy(
        string colorScheme,
        short alternateHueOffset,
        PartialColorData textColor,
        PartialColorData backgroundColor,
        PartialColorData alternateTextColor,
        PartialColorData alternateBackgroundColor,
        PartialColorData headerTextColor,
        PartialColorData headerBackgroundColor,
        PartialColorData hoverTextColor,
        PartialColorData hoverBackgroundColor,
        PartialColorData activeTextColor,
        PartialColorData activeBackgroundColor,
        PartialColorData activeHoverTextColor,
        PartialColorData activeHoverBackgroundColor,
        PartialColorData surfaceShadowColor,
        string shadowStrength
        )
    {
        ColorSchemeName = colorScheme;

        AlternateHueOffset = alternateHueOffset;

        TextColor = textColor;

        BackgroundColor = backgroundColor;

        AlternateTextColor = alternateTextColor;

        AlternateBackgroundColor = alternateBackgroundColor;

        HeaderTextColor = headerTextColor;

        HeaderBackgroundColor = headerBackgroundColor;

        HoverTextColor = hoverTextColor;

        HoverBackgroundColor = hoverBackgroundColor;

        ActiveTextColor = activeTextColor;

        ActiveBackgroundColor = activeBackgroundColor;

        ActiveHoverTextColor = activeHoverTextColor;

        ActiveHoverBackgroundColor = activeHoverBackgroundColor;

        SurfaceShadowColor = surfaceShadowColor;

        ShadowStrength = shadowStrength;
    }

}
