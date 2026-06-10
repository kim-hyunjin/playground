using System;
using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;
using WpfApp1.Models;

namespace WpfApp1.Converters
{
    /// <summary>
    /// Priority → Brush 색상. React에서 className/style 객체로 상태별 색을 주는 것과 유사.
    /// </summary>
    public class PriorityToBrushConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (!(value is TaskPriority priority))
            {
                return Brushes.Gray;
            }

            switch (priority)
            {
                case TaskPriority.High:
                    return new SolidColorBrush(Color.FromRgb(220, 53, 69));
                case TaskPriority.Medium:
                    return new SolidColorBrush(Color.FromRgb(255, 193, 7));
                case TaskPriority.Low:
                    return new SolidColorBrush(Color.FromRgb(40, 167, 69));
                default:
                    return Brushes.Gray;
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotSupportedException();
        }
    }
}
