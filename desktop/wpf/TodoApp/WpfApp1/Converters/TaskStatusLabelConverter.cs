using System;
using System.Globalization;
using System.Windows.Data;
using WpfApp1.Models;

namespace WpfApp1.Converters
{
    /// <summary>
    /// enum → 한글 라벨. React에서 formatStatus(status) 함수를 JSX에 쓰는 것과 동일한 역할.
    /// </summary>
    public class TaskStatusLabelConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (!(value is WorkItemStatus status))
            {
                return value;
            }

            switch (status)
            {
                case WorkItemStatus.Todo: return "할 일";
                case WorkItemStatus.InProgress: return "진행 중";
                case WorkItemStatus.Done: return "완료";
                default: return status.ToString();
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotSupportedException();
        }
    }
}
