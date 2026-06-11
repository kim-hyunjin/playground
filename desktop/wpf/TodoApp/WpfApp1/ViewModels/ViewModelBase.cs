using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace WpfApp1.ViewModels
{
    /// <summary>
    /// React의 setState/useState와 유사한 "변경 알림" 메커니즘.
    /// 속성이 바뀌면 INotifyPropertyChanged 이벤트를 발생시켜 UI가 자동 갱신됩니다.
    /// (React는 Virtual DOM diff, WPF는 바인딩 엔진이 PropertyChanged를 구독)
    /// </summary>
    public abstract class ViewModelBase : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// 속성 값을 설정하고, 변경 시 UI에 알립니다.
        /// [CallerMemberName]은 호출한 속성 이름을 자동으로 넘깁니다 (C# 6).
        /// </summary>
        protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string propertyName = null)
        {
            if (Equals(field, value))
            {
                return false;
            }

            field = value;
            OnPropertyChanged(propertyName);
            return true;
        }

        protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
