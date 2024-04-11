using CodeGeneration.Css;
using Utilities;

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
                var themes = new Theme[]
                {
                    new Theme
                    {
                        Name = "red",
                        Hue = 0
                    },
 
                    new Theme
                    {
                        Name = "orange",
                        Hue = 30
                    },
                    new Theme
                    {
                        Name = "yellow",
                        Hue = 60
                    },
                    new Theme
                    {
                        Name = "yellow-green",
                        Hue = 90
                    },
                    new Theme
                    {
                        Name = "green",
                        Hue = 120
                    },
                    new Theme
                    {
                        Name = "blue-green",
                        Hue = 150
                    },
                    new Theme
                    {
                        Name = "cyan",
                        Hue = 180
                    },
                    new Theme
                    {
                        Name = "blue",
                        Hue = 210
                    },
                    new Theme
                    {
                        Name = "blue-purple",
                        Hue = 240
                    },
                    new Theme
                    {
                        Name = "purple",
                        Hue = 270
                    },
                    new Theme
                    {
                        Name = "magenta",
                        Hue = 300
                    },
                    new Theme
                    {
                        Name = "red-magenta",
                        Hue = 330
                    }
                };

                foreach (var theme in themes)
                {
                    // Light theme
                    var lightThemeGenerator = new ThemeGenerator(
                        themeName: $"{theme.Name}-light",
                        hue: theme.Hue
                    );

                    lightThemeGenerator.Generate(builder, new LightThemeGenerationStrategy());

                    // Dark theme
                    var darkThemeGenerator = new ThemeGenerator(
                        themeName: $"{theme.Name}-dark",
                        hue: theme.Hue
                    );

                    darkThemeGenerator.Generate(builder, new DarkThemeGenerationStrategy());
                }
            }

            writer.ToString().SaveToFile(@"C:\Projects\FrontEnd.Solution\FrontEnd.Web\wwwroot\demo\css\themes.css");
        }
    }

    private class Theme
    {
        public string? Name { get; internal set; }

        public short Hue { get; internal set; }

        public float Lightness { get; internal set; }
    }
}