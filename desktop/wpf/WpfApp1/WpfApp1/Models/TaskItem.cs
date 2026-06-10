using System;

namespace WpfApp1.Models
{
    /// <summary>
    /// 도메인 모델(POCO). React에서 API 응답 타입/interface에 해당합니다.
    /// UI 로직은 ViewModel에 두고, 이 클래스는 순수 데이터만 담습니다.
    /// </summary>
    public class TaskItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Title { get; set; }

        public string Description { get; set; }

        public WorkItemStatus Status { get; set; } = WorkItemStatus.Todo;

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        public DateTime? DueDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
