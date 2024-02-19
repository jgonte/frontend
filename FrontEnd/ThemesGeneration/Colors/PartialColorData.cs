namespace FrontEnd;

/// <summary>
/// It is partial data because it is missing the hue which is dynamic
/// Some reference: https://designerup.co/blog/practical-guide-to-perfect-ui-color-palettes/
/// </summary>
public class PartialColorData
{
    public byte Saturation { get; private set; }

    public byte Lightness { get; private set; }

    public PartialColorData(byte saturation, byte lightness)
    {
        Saturation = saturation;

        Lightness = lightness;
    }

    #region Jewel (darker colors)

    public static PartialColorData JewelLight => new PartialColorData(saturation: 73, lightness: 40);

    public static PartialColorData JewelMiddle => new PartialColorData(saturation: 78, lightness: 30);

    public static PartialColorData JewelDark => new PartialColorData(saturation: 83, lightness: 20);

    #endregion

    #region Pastel (lighter colors)

    public static PartialColorData PastelLight => new PartialColorData(saturation: 70, lightness: 90);

    public static PartialColorData PastelMiddle => new PartialColorData(saturation: 75, lightness: 80);

    public static PartialColorData PastelDark => new PartialColorData(saturation: 80, lightness: 70);

    #endregion

    #region Earth (darker colors)
    public static PartialColorData EarthLight => new PartialColorData(saturation: 60, lightness: 40);

    public static PartialColorData EarthMiddle => new PartialColorData(saturation: 50, lightness: 30);

    public static PartialColorData EarthDark => new PartialColorData(saturation: 40, lightness: 20);

    #endregion;

    #region Neutral (lighter colors)

    public static PartialColorData NeutralLight => new PartialColorData(saturation: 10, lightness: 30);

    public static PartialColorData NeutralMiddle => new PartialColorData(saturation: 20, lightness: 20);

    public static PartialColorData NeutralDark => new PartialColorData(saturation: 30, lightness: 10);

    #endregion

    #region Neon (lighter colors)

    public static PartialColorData NeonLight => new PartialColorData(saturation: 80, lightness: 100);

    public static PartialColorData NeonMiddle => new PartialColorData(saturation: 90, lightness: 90);

    public static PartialColorData NeonDark => new PartialColorData(saturation: 100, lightness: 80);

    #endregion
}
