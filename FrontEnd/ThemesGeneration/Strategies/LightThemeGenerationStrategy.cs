namespace FrontEnd;

public class LightThemeGenerationStrategy : ThemeGenerationStrategy
{
    public override ColorResources GenerateResources(short hue)
    {
        var saturation = .6f;

        var textLightness = .2f;

        var backgroundLightness1 = .95f;

        var backgroundLightness2 = .8f;

        var backgroundLightness3 = .4f;

        return GenerateResources(
            hue,
            saturation,
            textLightness,
            backgroundLightness1,
            backgroundLightness2,
            backgroundLightness3
        );
    }

}
