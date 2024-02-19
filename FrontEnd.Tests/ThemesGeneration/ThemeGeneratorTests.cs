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
            hue: 300);

        using (var writer = new StringWriter())
        {
            using (var builder = new CssBuilder(writer))
            {
                generator.Generate(builder, new LightThemeGenerationStrategy());
            }

            Assert.AreEqual(
//@"[theme=""green-light""] {
//    --text-color: hsl(300, 50%, 10%);
//    --bg-color: hsl(300, 50%, 95%);
//    --alt-bg-color: hsl(300, 50%, 90%);
//    --header-text-color: hsl(300, 50%, 95%);
//    --header-bg-color: hsl(300, 50%, 40%);
//    --hover-text-color: hsl(300, 50%, 25%);
//    --hover-bg-color: hsl(300, 50%, 85%);
//    --active-text-color: hsl(480, 50%, 25%);
//    --active-bg-color: hsl(480, 50%, 85%);
//    --active-hover-text-color: hsl(480, 50%, 95%);
//    --active-hover-bg-color: hsl(480, 50%, 30%);
//    --surface-shadow: hsl(300, 50%, 20%);
//    --shadow-strength: .2;
//}

//"

@"[theme=""green-light""] {
    --text-color: hsl(300, 60%, 40%);
    --bg-color: hsl(300, 70%, 90%);
    --alt-text-color: hsl(300, 40%, 20%);
    --alt-bg-color: hsl(300, 80%, 70%);
    --header-text-color: hsl(300, 50%, 30%);
    --header-bg-color: hsl(300, 75%, 80%);
    --hover-text-color: hsl(300, 10%, 30%);
    --hover-bg-color: hsl(300, 10%, 30%);
    --active-text-color: hsl(480, 20%, 20%);
    --active-bg-color: hsl(480, 20%, 20%);
    --active-hover-text-color: hsl(480, 30%, 10%);
    --active-hover-bg-color: hsl(480, 83%, 20%);
    --surface-shadow: hsl(300, 60%, 40%);
    --shadow-strength: .2;
}

"
                , writer.ToString());
        }
    }
}
