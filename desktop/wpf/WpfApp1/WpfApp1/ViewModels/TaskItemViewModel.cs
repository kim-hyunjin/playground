using System;
using WpfApp1.Models;

namespace WpfApp1.ViewModels
{
    /// <summary>
    /// 단일 Task의 UI 상태 래퍼. React에서 list item 컴포넌트가 props를 받아
    /// 로컬 편집 상태를 관리하는 패턴과 비슷합니다.
    /// </summary>
    public class TaskItemViewModel : ViewModelBase
    {
        private readonly TaskItem _model;
        private string _title;
        private string _description;
        private WorkItemStatus _status;
        private TaskPriority _priority;
        private DateTime? _dueDate;

        public TaskItemViewModel(TaskItem model)
        {
            _model = model ?? throw new ArgumentNullException(nameof(model));
            _title = model.Title;
            _description = model.Description;
            _status = model.Status;
            _priority = model.Priority;
            _dueDate = model.DueDate;
        }

        public Guid Id => _model.Id;

        public string Title
        {
            get => _title;
            set
            {
                if (SetProperty(ref _title, value))
                {
                    _model.Title = value;
                    OnPropertyChanged(nameof(IsValid));
                }
            }
        }

        public string Description
        {
            get => _description;
            set
            {
                if (SetProperty(ref _description, value))
                {
                    _model.Description = value;
                }
            }
        }

        public WorkItemStatus Status
        {
            get => _status;
            set
            {
                if (SetProperty(ref _status, value))
                {
                    _model.Status = value;
                    OnPropertyChanged(nameof(StatusLabel));
                    OnPropertyChanged(nameof(IsOverdue));
                }
            }
        }

        public TaskPriority Priority
        {
            get => _priority;
            set
            {
                if (SetProperty(ref _priority, value))
                {
                    _model.Priority = value;
                }
            }
        }

        public DateTime? DueDate
        {
            get => _dueDate;
            set
            {
                if (SetProperty(ref _dueDate, value))
                {
                    _model.DueDate = value;
                    OnPropertyChanged(nameof(DueDateLabel));
                    OnPropertyChanged(nameof(IsOverdue));
                }
            }
        }

        public DateTime CreatedAt => _model.CreatedAt;

        /// <summary>UI 표시용 계산 속성. React의 derived state / useMemo와 유사.</summary>
        public string StatusLabel
        {
            get
            {
                switch (Status)
                {
                    case WorkItemStatus.Todo: return "할 일";
                    case WorkItemStatus.InProgress: return "진행 중";
                    case WorkItemStatus.Done: return "완료";
                    default: return Status.ToString();
                }
            }
        }

        public string DueDateLabel => DueDate?.ToString("yyyy-MM-dd") ?? "마감일 없음";

        public bool IsOverdue =>
            DueDate.HasValue
            && DueDate.Value.Date < DateTime.Today
            && Status != WorkItemStatus.Done;

        public bool IsValid => !string.IsNullOrWhiteSpace(Title);

        public TaskItem ToModel() => _model;

        /// <summary>외부(동기화 등)에서 파생 속성 갱신이 필요할 때 호출.</summary>
        public void RefreshOverdueState()
        {
            OnPropertyChanged(nameof(IsOverdue));
        }
    }
}
