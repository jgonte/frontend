namespace FrontEnd;

public struct HSL
{
    /// <summary>
    /// Hue (between 0 and 360)
    /// </summary>
    public short Hue { get; private set; }

    /// <summary>
    /// The saturation (between 0 and 1)
    /// </summary>
    public float Saturation { get; private set; }

    /// <summary>
    /// The lightness (between 0 and 1)
    /// </summary>
    public float Lightness { get; private set; }

    public HSL(short hue, float saturation, float lightness)
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
        int saturationPercent = (int)Math.Round(Saturation * 100);

        int lightnessPercent = (int)Math.Round(Lightness * 100);

        return $"hsl({Hue}, {saturationPercent}%, {lightnessPercent}%)";
    }

    public static short[] GenerateTriadicHues(short hue)
    {
        short[] hues = new short[2];

        hues[0] = (short)((hue + 120) % 360);

        hues[1] = (short)((hue + 240) % 360);

        return hues;
    }
}
