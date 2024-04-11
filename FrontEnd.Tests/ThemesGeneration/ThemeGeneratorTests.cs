using CodeGeneration.Css;

namespace FrontEnd.Tests;

[TestClass]
public class ThemeGeneratorTests
{
    [TestMethod]
    public void ThemeGenerator_generate_themes_for_single_color_tests()
    {
        var generator = new ThemeGenerator(
            themeName: "green",
            hue: 120
        );

        using (var writer = new StringWriter())
        {
            using (var builder = new CssBuilder(writer))
            {
                generator.Generate(builder, new LightThemeGenerationStrategy());
            }

            Assert.AreEqual(
@"[theme=""green""] {
    --gcs-color-primary-1: hsl(120, 60%, 20%);
    --gcs-bg-color-primary-1: hsl(120, 60%, 95%);
    --gcs-color-primary-2: hsl(120, 60%, 20%);
    --gcs-bg-color-primary-2: hsl(120, 60%, 80%);
    --gcs-color-primary-3: hsl(120, 60%, 95%);
    --gcs-bg-color-primary-3: hsl(120, 60%, 20%);
    --gcs-color-secondary-1: hsl(240, 60%, 20%);
    --gcs-bg-color-secondary-1: hsl(240, 60%, 95%);
    --gcs-color-secondary-2: hsl(240, 60%, 20%);
    --gcs-bg-color-secondary-2: hsl(240, 60%, 80%);
    --gcs-color-tertiary-1: hsl(0, 60%, 95%);
    --gcs-bg-color-tertiary-1: hsl(0, 60%, 40%);
}

"
                , writer.ToString());
        }
    }
}
