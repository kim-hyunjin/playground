using WpfApp1.Models;

namespace WpfApp1.ViewModels
{
    /// <summary>
    /// nullable enum을 ComboBox에 바인딩하기 위한 래퍼.
    /// WPF ComboBox는 null SelectedItem 처리가 까다로워 이런 패턴을 자주 씁니다.
    /// </summary>
    public class StatusFilterOption
    {
        public string Label { get; set; }

        public WorkItemStatus? Value { get; set; }
    }
}
