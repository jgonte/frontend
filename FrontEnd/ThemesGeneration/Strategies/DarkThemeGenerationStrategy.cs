namespace FrontEnd;

public class DarkThemeGenerationStrategy : ThemeGenerationStrategy
{
    public override ColorResources GenerateResources(short hue)
    {
        var saturation = .4f;

        var textLightness = .75f;

        var backgroundLightness1 = .1f;

        var backgroundLightness2 = .4f;

        var backgroundLightness3 = .7f;

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
