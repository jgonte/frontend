namespace FrontEnd.Tests;

[TestClass]
public class HSLTests
{
    [TestMethod]
    public void HSL_to_CSS_tests()
    {
        var hsl = new HSL(138, .505f, .7509f);

        Assert.AreEqual("hsl(138, 50%, 75%)", hsl.ToCss());
    }

    [TestMethod]
    public void HSL_generate_triadic_hues()
    {
        var hues = HSL.GenerateTriadicHues(0);

        Assert.AreEqual(120, hues[0]);

        Assert.AreEqual(240, hues[1]);

        hues = HSL.GenerateTriadicHues(120);

        Assert.AreEqual(240, hues[0]);

        Assert.AreEqual(0, hues[1]);

        hues = HSL.GenerateTriadicHues(240);

        Assert.AreEqual(0, hues[0]);

        Assert.AreEqual(120, hues[1]);
    }
}
