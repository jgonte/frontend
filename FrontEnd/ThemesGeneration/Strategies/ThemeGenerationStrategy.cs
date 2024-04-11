namespace FrontEnd;

public abstract class ThemeGenerationStrategy
{
    public abstract ColorResources GenerateResources(short hue);

    protected static ColorResources GenerateResources(short hue, float saturation, float textLightness, float backgroundLightness1, float backgroundLightness2, float backgroundLightness3)
    {
        var primaryTextColor = new HSL(hue, saturation, textLightness);

        var primaryBackgroundColor1 = new HSL(hue, saturation, backgroundLightness1);

        var primaryBackgroundColor2 = new HSL(hue, saturation, backgroundLightness2);

        var hues = HSL.GenerateTriadicHues(hue);

        var secondaryTextColor = new HSL(hues[0], saturation, textLightness);

        var secondaryBackgroundColor1 = new HSL(hues[0], saturation, backgroundLightness1);

        var secondaryBackgroundColor2 = new HSL(hues[0], saturation, backgroundLightness2);

        // Invert background colors for active
        var tertiaryTextColor = new HSL(hues[1], saturation, backgroundLightness1);

        var tertiaryBackgroundColor1 = new HSL(hues[1], saturation, backgroundLightness3);

        return new ColorResources
        {
            ColorPrimary1 = primaryTextColor,
            BackgroundColorPrimary1 = primaryBackgroundColor1,

            ColorPrimary2 = primaryTextColor,
            BackgroundColorPrimary2 = primaryBackgroundColor2,

            ColorPrimary3 = primaryBackgroundColor1,
            BackgroundColorPrimary3 = primaryTextColor,

            ColorSecondary1 = secondaryTextColor,
            BackgroundColorSecondary1 = secondaryBackgroundColor1,

            ColorSecondary2 = secondaryTextColor,
            BackgroundColorSecondary2 = secondaryBackgroundColor2,

            ColorTertiary1 = tertiaryTextColor,
            BackgroundColorTertiary1 = tertiaryBackgroundColor1,

        };
    }
}