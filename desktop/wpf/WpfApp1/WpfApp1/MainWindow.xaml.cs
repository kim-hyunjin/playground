using System.Windows;
using WpfApp1.ViewModels;

namespace WpfApp1
{
    /// <summary>
    /// View의 code-behind. MVVM에서는 UI 로직 대신 ViewModel을 DataContext에 연결합니다.
    /// React로 치면: const vm = useMainViewModel(); return <Layout data={vm} />;
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            // DataContext = React Context / props의 root 객체
            DataContext = new MainViewModel();
        }
    }
}
