using System.Windows.Controls;

namespace WpfApp1.Views
{
    /// <summary>
    /// TaskCardView의 code-behind. MVVM에서는 로직을 ViewModel에 두고
    /// code-behind는 InitializeComponent()만 두는 것이 일반적입니다.
    /// (React 컴포넌트 파일 하단의 export default와 유사한 진입점)
    /// </summary>
    public partial class TaskCardView : UserControl
    {
        public TaskCardView()
        {
            InitializeComponent();
        }
    }
}
