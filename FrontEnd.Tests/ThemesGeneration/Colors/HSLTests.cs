namespace FrontEnd.Tests;

[TestClass]
public class HSLTests
{
    [TestMethod]
    public void HSL_to_CSS_tests()
    {
        var hsl = new HSL(138, 50, 75);

        Assert.AreEqual("hsl(138, 50%, 75%)", hsl.ToCss());
    }

    [TestMethod]
    public void HSL_generate_monochromatic_scale_blue()
    {
        var blue = new HSL(0, 100, 100);

        var scale = blue.GenerateMonochromaticScale(n: 5);

        Assert.AreEqual(5, scale.Length);

        Assert.AreEqual("hsl(0, 100%, 28%)", scale[0].ToCss());

        Assert.AreEqual("hsl(0, 100%, 42%)", scale[1].ToCss());

        Assert.AreEqual("hsl(0, 100%, 56%)", scale[2].ToCss());

        Assert.AreEqual("hsl(0, 100%, 70%)", scale[3].ToCss());

        Assert.AreEqual("hsl(0, 100%, 84%)", scale[4].ToCss());
    }
}
