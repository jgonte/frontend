namespace FrontEnd;

public struct HSL
{
    /// <summary>
    /// Hue (between 0 and 360
    /// </summary>
    public short Hue { get; private set; }

    /// <summary>
    /// The saturation (between 0 and 100%)
    /// </summary>
    public byte Saturation { get; private set; }

    /// <summary>
    /// The lightness (between 0 and 100%)
    /// </summary>
    public byte Lightness { get; private set; }

    public HSL(short hue, byte saturation, byte lightness)
    {
        if (hue < 0 && hue > 360)
        {
            throw new ArgumentOutOfRangeException("hue must be between 0 and 360");
        }

        if (saturation < 0 && saturation > 100)
        {
            throw new ArgumentOutOfRangeException("saturation must be between 0 and 100");
        }

        if (lightness < 0 && lightness > 100)
        {
            throw new ArgumentOutOfRangeException("lightness must be between 0 and 100");
        }

        Hue = hue;

        Saturation = saturation;

        Lightness = lightness;
    }

    public string ToCss()
    {
        return $"hsl({Hue}, {Saturation}%, {Lightness}%)";
    }

    public HSL[] GenerateMonochromaticScale(int n)
    {
        var scale = new HSL[n];

        var lightnessSteps = Convert.ToByte(100 / (n + 2));

        var lightness = lightnessSteps;

        for (int i = 0; i < n; ++i)
        {
            lightness += lightnessSteps;

            scale[i] = new HSL(Hue, Saturation, lightness);
        }

        return scale;
    }
}
