using System;
using System.Windows.Input;

namespace WpfApp1.ViewModels
{
    /// <summary>
    /// ICommand ≈ React의 onClick/onSubmit 핸들러를 XAML에서 선언적으로 연결.
    /// Command="{Binding AddTaskCommand}" → Button 클릭 시 ViewModel 메서드 실행.
    /// CanExecute로 버튼 disabled 상태도 제어 가능 (React의 disabled={!isValid}와 유사).
    /// </summary>
    public class RelayCommand : ICommand
    {
        private readonly Action<object> _execute;
        private readonly Predicate<object> _canExecute;

        public RelayCommand(Action execute, Func<bool> canExecute = null)
        {
            if (execute == null)
            {
                throw new ArgumentNullException(nameof(execute));
            }

            _execute = _ => execute();
            _canExecute = canExecute != null ? (Predicate<object>)(_ => canExecute()) : null;
        }

        public RelayCommand(Action<object> execute, Predicate<object> canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }

        public bool CanExecute(object parameter) => _canExecute == null || _canExecute(parameter);

        public void Execute(object parameter) => _execute(parameter);
    }
}
