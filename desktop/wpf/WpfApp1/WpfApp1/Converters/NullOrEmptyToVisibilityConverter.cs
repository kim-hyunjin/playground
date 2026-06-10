using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace WpfApp1.Converters
{
    /// <summary>
    /// null/빈 문자열일 때 플레이스홀더 UI 표시. React의 empty state 패턴.
    /// </summary>
    public class NullOrEmptyToVisibilityConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var isEmpty = value == null
                || (value is string s && string.IsNullOrWhiteSpace(s))
                || (value is int count && count == 0);

            if (parameter != null && parameter.ToString() == "Inverse")
            {
                isEmpty = !isEmpty;
            }

            return isEmpty ? Visibility.Visible : Visibility.Collapsed;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotSupportedException();
        }
    }
}
