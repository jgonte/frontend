namespace FrontEnd;

public class ApplicationTypeOutputDto
{
    public string Title { get; set; }

    public string Logo { get; set; }

    /// <summary>
    /// The scripts directly referenced by the application
    /// </summary>
    public ScriptOutputDto[] Scripts { get; set; }

    public ModuleOutputDto[] Modules { get; set; }

    public RouteOutputDto[] Routes { get; set; }
    
}