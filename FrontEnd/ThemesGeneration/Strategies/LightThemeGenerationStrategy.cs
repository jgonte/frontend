namespace FrontEnd;

public class LightThemeGenerationStrategy : ThemeGenerationStrategy
{
    public LightThemeGenerationStrategy() :
        base(
            colorScheme: "light",
            alternateHueOffset: 180,
            textColor: PartialColorData.EarthLight,
            backgroundColor: PartialColorData.PastelLight,
            alternateTextColor: PartialColorData.EarthDark,
            alternateBackgroundColor: PartialColorData.PastelDark,
            headerTextColor: PartialColorData.EarthMiddle,
            headerBackgroundColor: PartialColorData.PastelMiddle,
            hoverTextColor: PartialColorData.NeutralLight,
            hoverBackgroundColor: PartialColorData.JewelLight,
            activeTextColor: PartialColorData.NeutralMiddle,
            activeBackgroundColor: PartialColorData.JewelMiddle,
            activeHoverTextColor: PartialColorData.NeutralDark,
            activeHoverBackgroundColor: PartialColorData.JewelDark,
            surfaceShadowColor: PartialColorData.EarthLight,
            shadowStrength: ".2"
        )
    {
    }
}
