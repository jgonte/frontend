using FrontEnd.Helpers;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;

namespace FrontEnd;

[Route("api/contacts")]
[ApiController]
public class ContactsController : ControllerBase
{
    private ILogger<ContactsController> _logger;

    public ContactsController(ILogger<ContactsController> logger)
    {
        _logger = logger;
    }

    // GET: api/<ContactsController>
    [HttpGet]
    public IEnumerable<ContactOutputDto> Get()
    {
        _logger.LogInformation("Getting contacts");

        return new ContactOutputDto[]
        {
            new ContactOutputDto
            {
                Id = 1,
                Name = "Sarah",
                DateOfBirth = new DateTime(2003, 6, 26),
                Gender = "f",
                Description = "Very beautiful and smart",
                Reputation = 10,
                Avatar = new MemoryFile(
                    name: "Sarah.jpeg",
                    type: "image/jpeg",
                    content: ImageFromText("S", new Font(FontFamily.GenericMonospace, 15), Color.DarkBlue, Color.Cornsilk)
                )
            },
            new ContactOutputDto
            {
                Id = 2,
                Name = "Mark",
                DateOfBirth = new DateTime(1993, 10, 4),
                Gender = "m",
                Description = "Very hard worker and focused",
                Reputation = 10,
                Avatar = new MemoryFile(
                    name: "Mark.jpeg",
                    type: "image/jpeg",
                    content: ImageFromText("M", new Font(FontFamily.GenericMonospace, 15), Color.DarkGreen, Color.Gray)
                )
            },
            new ContactOutputDto
            {
                Id = 3,
                Name = "Jorge",
                DateOfBirth = new DateTime(1976, 11, 20),
                Gender = "m",
                Description = "Ugly, stupid but not a bad person",
                Reputation = 7,
                Avatar = new MemoryFile(
                    name: "Jorge.jpeg",
                    type: "image/jpeg",
                    content: ImageFromText("J", new Font(FontFamily.GenericMonospace, 15), Color.DarkRed, Color.Beige)
                )
            }
        };
    }

    private byte[] ImageFromText(string text, Font font, Color textColor, Color backColor)
    {
        var image = DrawText(text, font, textColor, backColor);

        return ImageToByteArray(image);
    }

    private Image DrawText(String text, Font font, Color textColor, Color backColor)
    {
        //first, create a dummy bitmap just to get a graphics object  
        Image img = new Bitmap(1, 1);
        Graphics drawing = Graphics.FromImage(img);

        //measure the string to see how big the image needs to be  
        SizeF textSize = drawing.MeasureString(text, font);

        //free up the dummy image and old graphics object  
        img.Dispose();
        drawing.Dispose();

        //create a new image of the right size  
        img = new Bitmap((int)textSize.Width, (int)textSize.Height);

        drawing = Graphics.FromImage(img);

        //paint the background  
        drawing.Clear(backColor);

        //create a brush for the text  
        Brush textBrush = new SolidBrush(textColor);

        drawing.DrawString(text, font, textBrush, 0, 0);

        drawing.Save();

        textBrush.Dispose();
        drawing.Dispose();

        return img;

    }
    private byte[] ImageToByteArray(Image image)
    {
        MemoryStream ms = new MemoryStream();

        image.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);

        return ms.ToArray();
    }

    // GET api/contacts/5
    [HttpGet("{id}")]
    public ContactOutputDto Get(int id)
    {
        _logger.LogInformation("Getting contact with id: {id}", id);

        if (id < 1 && id > 3)
        {
            return null;
        }

        var contacts = new ContactOutputDto[]
        {
            new ContactOutputDto
            {
                Id = 1,
                Name = "Sarah",
                DateOfBirth = new DateTime(2003, 6, 26),
                Gender = "F",
                Description = "Very beautiful and smart",
                Reputation = 10,
                Avatar = new MemoryFile(
                    name: "Sarah.jpeg",
                    type: "image/jpeg",
                    content: ImageFromText("S", new Font(FontFamily.GenericMonospace, 15), Color.DarkBlue, Color.Cornsilk)
                )
            },
            new ContactOutputDto
            {
                Id = 2,
                Name = "Mark",
                DateOfBirth = new DateTime(1993, 10, 4),
                Gender = "M",
                Description = "Very hard worker and focused",
                Reputation = 10,
                Avatar = new MemoryFile(
                    name: "Mark.jpeg",
                    type: "image/jpeg",
                    content: ImageFromText("M", new Font(FontFamily.GenericMonospace, 15), Color.DarkGreen, Color.Gray)
                )
            },
            new ContactOutputDto
            {
                Id = 3,
                Name = "Jorge",
                DateOfBirth = new DateTime(1976, 11, 20),
                Gender = "M",
                Description = "Ugly, stupid but not a bad person",
                Reputation = 7,
                Avatar = new MemoryFile(
                    name: "Jorge.jpeg",
                    type: "image/jpeg",
                    content: ImageFromText("J", new Font(FontFamily.GenericMonospace, 15), Color.DarkRed, Color.Beige)
                )
            }
        };

        return contacts[id - 1];
    }

    // POST api/contacts
    [HttpPost]
    [Consumes("multipart/form-data")]
    public IActionResult Post([FromForm] ContactInputDto contact)
    {
        return Ok(new ContactPostOutputDto { Id = 5 });
    }

    // PUT api/contacts/5
    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    public IActionResult Put(int id, [FromForm] ContactInputDto contact)
    {
        return NoContent();
    }

    // DELETE api/contacts/5
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        return NoContent();
    }
}
