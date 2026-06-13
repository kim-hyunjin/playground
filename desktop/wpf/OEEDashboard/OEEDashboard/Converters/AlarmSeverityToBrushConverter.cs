using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;
using OEEDashboard.Models;

namespace OEEDashboard.Converters;

public sealed class AlarmSeverityToBrushConverter : IValueConverter
{
    public object Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is not AlarmSeverity severity)
        {
            return Brushes.Gray;
        }

        return severity switch
        {
            AlarmSeverity.Critical => new SolidColorBrush(Color.FromRgb(220, 38, 38)),
            AlarmSeverity.Warning => new SolidColorBrush(Color.FromRgb(217, 119, 6)),
            _ => new SolidColorBrush(Color.FromRgb(37, 99, 235))
        };
    }

    public object ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotSupportedException();
}
