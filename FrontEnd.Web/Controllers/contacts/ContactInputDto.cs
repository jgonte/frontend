namespace FrontEnd;

public class ContactInputDto
{
    public int? Id { get; set; }

    public string Name { get; set; }

    public string Gender { get; set; }

    public DateTimeOffset? DateOfBirth { get; set; }

    public int? Reputation { get; set; }

    public string Description { get; set; }

    public IFormFile Avatar { get; set; }
}
