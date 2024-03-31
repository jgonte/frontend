using CodeGeneration.Css;

namespace FrontEnd;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("1. Generate Themes");
        Console.WriteLine("Enter the number of the option you want to select: ");

        // Read the option selected by the user
        string option = Console.ReadLine();

        // Process the selected option
        switch (option)
        {
            case "1":
                GenerateThemes();
                break;
            default:
                Console.WriteLine("Invalid option selected.");
                break;
        }
    }

    private static void GenerateThemes()
    {
        using (var writer = new StringWriter())
        {
            using (var builder = new CssBuilder(writer))
            {
                var hues = new short[] { 0, 30, 60, 90, 130 };

                foreach (var hue in hues)
                {
                    var generator = new ThemeGenerator(
                        themeName: "{}-light",
                        hue: hue
                    );

                    generator.Generate(builder, new LightThemeGenerationStrategy());
                }

            }
        }
    }
}