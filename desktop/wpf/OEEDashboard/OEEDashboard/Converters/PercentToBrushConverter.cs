using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;

namespace OEEDashboard.Converters;

public sealed class PercentToBrushConverter : IValueConverter
{
    public object Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        var percent = value switch
        {
            double d => d,
            float f => f,
            int i => i,
            _ => 0d
        };

        var color = percent switch
        {
            >= 75 => Color.FromRgb(22, 163, 74),
            >= 60 => Color.FromRgb(217, 119, 6),
            _ => Color.FromRgb(220, 38, 38)
        };

        return new SolidColorBrush(color);
    }

    public object ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotSupportedException();
}
