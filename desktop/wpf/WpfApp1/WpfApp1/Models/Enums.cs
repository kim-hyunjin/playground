namespace WpfApp1.Models
{
    /// <summary>
    /// C# enum ≈ TypeScript union type + 상수 객체.
    /// WPF ComboBox ItemsSource에 바인딩할 때 자주 사용합니다.
    /// </summary>
    /// <summary>
    /// 작업 상태 enum. BCL의 System.Threading.Tasks.TaskStatus와 이름이 겹치지 않도록 WorkItemStatus 사용.
    /// </summary>
    public enum WorkItemStatus
    {
        Todo,
        InProgress,
        Done
    }

    public enum TaskPriority
    {
        Low,
        Medium,
        High
    }
}
