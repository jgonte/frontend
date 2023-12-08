namespace FrontEnd.Helpers;

/// <summary>
/// Describes a file in memory
/// </summary>
public class MemoryFile
{
    public MemoryFile(string name, string type, byte[] content)
    {
        Name = name;
        Type = type;
        Content = content;
        Size = content.Length;
    }

    public string Name { get; /*set;*/ }

    public string Type { get; /*set;*/ }

    public long Size { get; /*set;*/ }

    public byte[] Content { get; /*set;*/ }
}
