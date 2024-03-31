namespace FrontEnd;

public class DarkThemeGenerationStrategy : ThemeGenerationStrategy
{
    public DarkThemeGenerationStrategy()
        :base(
            colorScheme: "dark",
            alternateHueOffset: 180,
            textColor: PartialColorData.PastelLight ,
            backgroundColor: PartialColorData.EarthLight,
            alternateTextColor: PartialColorData.PastelDark,
            alternateBackgroundColor: PartialColorData.EarthDark,
            headerTextColor: PartialColorData.PastelMiddle,
            headerBackgroundColor: PartialColorData.EarthMiddle,
            hoverTextColor: PartialColorData.JewelLight,
            hoverBackgroundColor: PartialColorData.NeutralLight,
            activeTextColor: PartialColorData.JewelMiddle,
            activeBackgroundColor: PartialColorData.NeutralMiddle,
            activeHoverTextColor: PartialColorData.JewelDark,
            activeHoverBackgroundColor: PartialColorData.NeutralDark,
            surfaceShadowColor: PartialColorData.NeutralDark,
            shadowStrength: ".8"
        )
    {
    }
}
