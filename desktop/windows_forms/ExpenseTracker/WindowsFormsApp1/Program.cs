using System;
using System.Windows.Forms;

namespace WindowsFormsApp1
{
    /// <summary>
    /// WinForms 애플리케이션의 진입점(Entry Point)입니다.
    /// </summary>
    internal static class Program
    {
        [STAThread]  // COM(클립보드, 드래그앤드롭 등) 호환을 위해 단일 스레드 아파트먼트 필요
        static void Main()
        {
            // Windows XP 이후 비주얼 스타일(테마) 적용
            Application.EnableVisualStyles();

            // GDI+ 텍스트 렌더링 대신 GDI 사용 (레거시 호환)
            Application.SetCompatibleTextRenderingDefault(false);

            // 메시지 루프 시작 — MainForm이 닫힐 때까지 앱 실행
            Application.Run(new MainForm());
        }
    }
}
