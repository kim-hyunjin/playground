using System;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Data;
using System.Windows.Input;
using WpfApp1.Models;

namespace WpfApp1.ViewModels
{
    /// <summary>
    /// 메인 화면 ViewModel. React의 page-level container + custom hook 역할.
    /// View(MainWindow.xaml)는 DataContext로 이 객체 하나만 바인딩합니다.
    /// </summary>
    public class MainViewModel : ViewModelBase
    {
        private string _searchText = string.Empty;
        private StatusFilterOption _selectedStatusFilter;
        private TaskItemViewModel _selectedTask;
        private bool _isLoading;
        private string _statusMessage = "준비됨";

        public MainViewModel()
        {
            Tasks = new ObservableCollection<TaskItemViewModel>();
            Tasks.CollectionChanged += OnTasksCollectionChanged;
            TasksView = CollectionViewSource.GetDefaultView(Tasks);
            TasksView.Filter = FilterTasks;

            StatusFilterOptions = new[]
            {
                new StatusFilterOption { Label = "전체", Value = null },
                new StatusFilterOption { Label = "할 일", Value = WorkItemStatus.Todo },
                new StatusFilterOption { Label = "진행 중", Value = WorkItemStatus.InProgress },
                new StatusFilterOption { Label = "완료", Value = WorkItemStatus.Done }
            };
            _selectedStatusFilter = StatusFilterOptions[0];

            SeedSampleData();

            AddTaskCommand = new RelayCommand(AddTask);
            DeleteTaskCommand = new RelayCommand(DeleteSelectedTask, () => SelectedTask != null);
            SaveTaskCommand = new RelayCommand(SaveSelectedTask, () => SelectedTask?.IsValid == true);
            RefreshCommand = new RelayCommand(async () => await RefreshTasksAsync());
            ClearFiltersCommand = new RelayCommand(ClearFilters);
        }

        /// <summary>
        /// ObservableCollection ≈ useState([]) + 배열 변경 시 UI 자동 갱신.
        /// List<T>와 달리 Add/Remove 시 CollectionChanged 이벤트가 발생합니다.
        /// </summary>
        public ObservableCollection<TaskItemViewModel> Tasks { get; }

        /// <summary>
        /// ICollectionView ≈ React에서 filter/sort된 파생 리스트.
        /// Filter predicate로 검색·상태 필터를 적용합니다.
        /// </summary>
        public ICollectionView TasksView { get; }

        public string SearchText
        {
            get => _searchText;
            set
            {
                if (SetProperty(ref _searchText, value))
                {
                    TasksView.Refresh();
                    OnPropertyChanged(nameof(FilteredCount));
                }
            }
        }

        public StatusFilterOption[] StatusFilterOptions { get; }

        /// <summary>ComboBox SelectedItem — "전체"는 Value=null (React의 undefined filter).</summary>
        public StatusFilterOption SelectedStatusFilter
        {
            get => _selectedStatusFilter;
            set
            {
                if (SetProperty(ref _selectedStatusFilter, value))
                {
                    TasksView.Refresh();
                    OnPropertyChanged(nameof(FilteredCount));
                }
            }
        }

        public TaskItemViewModel SelectedTask
        {
            get => _selectedTask;
            set
            {
                if (SetProperty(ref _selectedTask, value))
                {
                    CommandManager.InvalidateRequerySuggested();
                }
            }
        }

        public bool IsLoading
        {
            get => _isLoading;
            set
            {
                if (SetProperty(ref _isLoading, value))
                {
                    OnPropertyChanged(nameof(CanRefresh));
                }
            }
        }

        public bool CanRefresh => !IsLoading;

        public string StatusMessage
        {
            get => _statusMessage;
            set => SetProperty(ref _statusMessage, value);
        }

        public int TotalCount => Tasks.Count;

        public int FilteredCount => TasksView.Cast<TaskItemViewModel>().Count();

        public int TodoCount => Tasks.Count(t => t.Status == WorkItemStatus.Todo);

        public int InProgressCount => Tasks.Count(t => t.Status == WorkItemStatus.InProgress);

        public int DoneCount => Tasks.Count(t => t.Status == WorkItemStatus.Done);

        public ICommand AddTaskCommand { get; }

        public ICommand DeleteTaskCommand { get; }

        public ICommand SaveTaskCommand { get; }

        public ICommand RefreshCommand { get; }

        public ICommand ClearFiltersCommand { get; }

        /// <summary>ComboBox ItemsSource용 — enum 값 목록.</summary>
        public Array StatusOptions => Enum.GetValues(typeof(WorkItemStatus));

        public Array PriorityOptions => Enum.GetValues(typeof(TaskPriority));

        private bool FilterTasks(object item)
        {
            var task = item as TaskItemViewModel;
            if (task == null)
            {
                return false;
            }

            var filterValue = SelectedStatusFilter?.Value;
            if (filterValue.HasValue && task.Status != filterValue.Value)
            {
                return false;
            }

            if (string.IsNullOrWhiteSpace(SearchText))
            {
                return true;
            }

            var query = SearchText.Trim();
            return (task.Title != null && task.Title.IndexOf(query, StringComparison.OrdinalIgnoreCase) >= 0)
                || (task.Description != null && task.Description.IndexOf(query, StringComparison.OrdinalIgnoreCase) >= 0);
        }

        private void AddTask()
        {
            var model = new TaskItem
            {
                Title = "새 작업",
                Description = string.Empty,
                Status = WorkItemStatus.Todo,
                Priority = TaskPriority.Medium,
                DueDate = DateTime.Today.AddDays(3)
            };

            var vm = new TaskItemViewModel(model);
            Tasks.Insert(0, vm);
            SelectedTask = vm;
            RefreshCounts();
            StatusMessage = "새 작업을 추가했습니다.";
        }

        private void DeleteSelectedTask()
        {
            if (SelectedTask == null)
            {
                return;
            }

            var removed = SelectedTask;
            Tasks.Remove(removed);
            SelectedTask = Tasks.FirstOrDefault();
            RefreshCounts();
            StatusMessage = $"'{removed.Title}' 작업을 삭제했습니다.";
        }

        private void SaveSelectedTask()
        {
            if (SelectedTask == null || !SelectedTask.IsValid)
            {
                return;
            }
            StatusMessage = $"'{SelectedTask.Title}' 저장됨 (모델: {SelectedTask.ToModel().Id})";
        }

        private void ClearFilters()
        {
            SearchText = string.Empty;
            SelectedStatusFilter = StatusFilterOptions[0];
            StatusMessage = "필터를 초기화했습니다.";
        }

        /// <summary>
        /// async/await ≈ React의 async fetch + loading state.
        /// Task.Delay로 네트워크 지연을 시뮬레이션합니다.
        /// </summary>
        private async Task RefreshTasksAsync()
        {
            IsLoading = true;
            StatusMessage = "동기화 중...";

            try
            {
                await Task.Delay(1200);

                foreach (var task in Tasks)
                {
                    task.RefreshOverdueState();
                }

                RefreshCounts();
                StatusMessage = $"동기화 완료 · {DateTime.Now:HH:mm:ss}";
            }
            finally
            {
                IsLoading = false;
            }
        }

        private void RefreshCounts()
        {
            OnPropertyChanged(nameof(TotalCount));
            OnPropertyChanged(nameof(FilteredCount));
            OnPropertyChanged(nameof(TodoCount));
            OnPropertyChanged(nameof(InProgressCount));
            OnPropertyChanged(nameof(DoneCount));
            TasksView.Refresh();
        }

        /// <summary>
        /// 자식 ViewModel 속성 변경 시 상위 집계(TodoCount 등)를 갱신합니다.
        /// React로 치면 list item state가 바뀔 때 부모의 useMemo 의존성을 트리거하는 것과 같습니다.
        /// </summary>
        private void OnTasksCollectionChanged(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (e.NewItems != null)
            {
                foreach (TaskItemViewModel task in e.NewItems)
                {
                    task.PropertyChanged += OnTaskPropertyChanged;
                }
            }

            if (e.OldItems != null)
            {
                foreach (TaskItemViewModel task in e.OldItems)
                {
                    task.PropertyChanged -= OnTaskPropertyChanged;
                }
            }
        }

        private void OnTaskPropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(TaskItemViewModel.Status))
            {
                RefreshCounts();
            }
        }

        private void SeedSampleData()
        {
            var samples = new[]
            {
                new TaskItem
                {
                    Title = "WPF 데이터 바인딩 학습",
                    Description = "OneWay/TwoWay 바인딩과 UpdateSourceTrigger 확인",
                    Status = WorkItemStatus.InProgress,
                    Priority = TaskPriority.High,
                    DueDate = DateTime.Today.AddDays(1)
                },
                new TaskItem
                {
                    Title = "MVVM 패턴 정리",
                    Description = "View / ViewModel / Model 역할 분리",
                    Status = WorkItemStatus.Todo,
                    Priority = TaskPriority.Medium,
                    DueDate = DateTime.Today.AddDays(5)
                },
                new TaskItem
                {
                    Title = "React vs WPF 비교 문서 읽기",
                    Description = "LEARNING.md 전체 훑어보기",
                    Status = WorkItemStatus.Done,
                    Priority = TaskPriority.Low,
                    DueDate = DateTime.Today.AddDays(-1)
                }
            };

            foreach (var item in samples)
            {
                Tasks.Add(new TaskItemViewModel(item));
            }

            SelectedTask = Tasks.FirstOrDefault();
            RefreshCounts();
        }
    }
}
