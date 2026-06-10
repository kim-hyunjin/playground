# WPF + C# 학습 가이드 (React 개발자용)

이 프로젝트는 **Task Board** 앱입니다. CRUD, 검색/필터, 마스터-디테일 편집, async 동기화, 재사용 UI 컴포넌트까지 React에서 자주 쓰는 패턴과 1:1로 대응되는 WPF 개념을 담았습니다.

## 실행 방법

1. Visual Studio에서 `WpfApp1.sln` 열기
2. **F5** (디버그 실행) 또는 **Ctrl+F5**

> .NET Framework 4.7.2 WPF 프로젝트입니다. Windows + Visual Studio(또는 Build Tools)가 필요합니다.

---

## 프로젝트 구조

```
WpfApp1/
├── LEARNING.md              ← 이 문서
├── App.xaml                 ← 전역 스타일·Converter (global CSS)
├── MainWindow.xaml          ← 메인 View (page layout)
├── Models/                  ← 도메인 데이터 (API types)
├── ViewModels/              ← UI 상태·로직 (hooks + container)
├── Views/                   ← 재사용 UserControl (components)
└── Converters/              ← 표시 변환 (formatters)
```

### React ↔ WPF 대응표

| React | WPF | 이 프로젝트 예시 |
|-------|-----|------------------|
| JSX | XAML | `MainWindow.xaml` |
| `useState` | `INotifyPropertyChanged` + 속성 | `ViewModelBase.SetProperty` |
| `useState([])` | `ObservableCollection<T>` | `MainViewModel.Tasks` |
| `useMemo` / derived state | 계산 속성 (getter) | `TodoCount`, `IsOverdue` |
| `filter()` / `useMemo` | `ICollectionView.Filter` | `TasksView` + `SearchText` |
| Context / props drilling | `DataContext` + Binding | `DataContext = new MainViewModel()` |
| `onClick` | `ICommand` | `AddTaskCommand` |
| 컴포넌트 | `UserControl` | `TaskCardView` |
| `.map(item => <Card />)` | `ItemsControl` + `DataTemplate` | `ListBox` + `TaskCardView` |
| CSS class | `Style` | `App.xaml`의 `PrimaryButtonStyle` |
| `{cond && <X />}` | `Visibility` + Converter | `BoolToVisibilityConverter` |
| `useEffect` + fetch | `async/await` + loading flag | `RefreshTasksAsync` |

---

## 1. C# 문법 빠른 정리

### 네임스페이스와 partial class

```csharp
namespace WpfApp1.ViewModels
{
    public partial class MainViewModel : ViewModelBase { }
}
```

- **namespace**: 폴더/모듈 경계 (ES modules의 package 경로와 유사)
- **partial**: XAML이 생성하는 코드(`MainWindow.g.cs`)와 손으로 쓴 code-behind를 한 클래스로 합침

### 속성 (Property)

C#에서는 public 필드 대신 **property**를 씁니다.

```csharp
private string _title;
public string Title
{
    get => _title;
    set => SetProperty(ref _title, value);
}
```

React의 `const [title, setTitle] = useState('')`에서 **getter/setter + 변경 알림**이 합쳐진 형태입니다.

### `=>` (expression-bodied member)

```csharp
public int TotalCount => Tasks.Count;
```

한 줄짜리 getter. React arrow function으로 값을 return하는 computed와 같습니다.

### `?.` null-conditional

```csharp
SelectedTask?.IsValid
```

`SelectedTask`가 null이면 예외 없이 null 반환 (optional chaining).

### `nameof`

```csharp
OnPropertyChanged(nameof(Title));
```

문자열 `"Title"` 대신 컴파일 타임에 속성 이름을 참조 → 리네임 시 안전.

### enum

```csharp
public enum WorkItemStatus { Todo, InProgress, Done }
```

TypeScript union `'todo' | 'inProgress' | 'done'` + 상수 객체의 타입 안전 버전.

### async / await

```csharp
await Task.Delay(1200);
```

JavaScript `await fetch(...)`와 동일한 제어 흐름. WPF UI 스레드에서는 `Task.Run`으로 무거운 작업을 백그라운드로 보내는 패턴도 많이 씁니다.

---

## 2. MVVM 패턴

WPF에서 가장 널리 쓰는 구조입니다.

```
View (XAML)  ←── Binding ──→  ViewModel  ←── uses ──→  Model
   │                              │
   │ UI만                          │ 상태·Command·비즈니스 로직
   └ code-behind는 최소화            └ View를 직접 참조하지 않음
```

### Model (`Models/`)

- 순수 데이터. UI를 모릅니다.
- React: `interface Task { id, title, ... }`

### ViewModel (`ViewModels/`)

- 화면에 필요한 상태 + Command + 필터/집계 로직
- React: page component의 state + handlers를 custom hook으로 분리한 것

### View (`*.xaml`)

- 레이아웃과 바인딩 선언만
- React: JSX (단, 이벤트 핸들러 로직은 ViewModel Command로)

**학습 포인트**: `MainWindow.xaml.cs`는 `DataContext` 할당만 합니다. 버튼 Click 이벤트 핸들러를 code-behind에 두지 않은 이유가 이것입니다.

---

## 3. 데이터 바인딩

바인딩은 WPF의 핵심입니다. React가 re-render로 UI를 맞춘다면, WPF는 **속성 변경 이벤트 → 바인딩 타겟 자동 갱신**입니다.

### OneWay (기본)

```xml
<TextBlock Text="{Binding TotalCount}" />
```

ViewModel → UI만. React에서 state를 읽어 표시하는 것과 같습니다.

### TwoWay

```xml
<TextBox Text="{Binding SearchText, UpdateSourceTrigger=PropertyChanged}" />
```

입력할 때마다 ViewModel에 반영. React controlled component (`value` + `onChange`)와 유사.

- `UpdateSourceTrigger=PropertyChanged`: 키 입력마다 즉시 반영 (기본값 LostFocus는 포커스를 잃을 때)

### 중첩 바인딩

편집 패널에서:

```xml
<StackPanel DataContext="{Binding SelectedTask}">
    <TextBox Text="{Binding Title}" />
</StackPanel>
```

`DataContext`가 `SelectedTask`로 바뀌면 `{Binding Title}`은 `SelectedTask.Title`을 가리킵니다.

### RelativeSource

ViewModel 속성(예: `StatusOptions`)은 Window 루트에 있고, 현재 DataContext는 `SelectedTask`일 때:

```xml
ItemsSource="{Binding DataContext.StatusOptions, RelativeSource={RelativeSource AncestorType=Window}}"
```

React의 Context나 props를 위로 올려서 전달하는 패턴과 비슷합니다.

---

## 4. INotifyPropertyChanged

`ViewModelBase.cs`를 읽어보세요.

1. 속성 setter에서 값이 바뀌면 `PropertyChanged` 이벤트 발생
2. WPF 바인딩 엔진이 구독 중 → 해당 UI 컨트롤 갱신

**실험**: `SetProperty` 호출을 빼고 `_title = value`만 하면 TextBox/UI가 갱신되지 않습니다.

---

## 5. ObservableCollection & ICollectionView

### ObservableCollection

```csharp
public ObservableCollection<TaskItemViewModel> Tasks { get; }
```

`Add`, `Remove`, `Insert` 시 UI 목록이 자동 갱신됩니다.  
일반 `List<T>`는 Count가 바뀌어도 UI가 모를 수 있습니다.

### ICollectionView (필터)

```csharp
TasksView = CollectionViewSource.GetDefaultView(Tasks);
TasksView.Filter = FilterTasks;
// SearchText 변경 시:
TasksView.Refresh();
```

React:

```javascript
const filtered = useMemo(
  () => tasks.filter(t => t.title.includes(search)),
  [tasks, search]
);
```

와 같은 역할입니다. **원본 컬렉션은 유지**하고 View만 필터링합니다.

---

## 6. ICommand (RelayCommand)

```xml
<Button Command="{Binding AddTaskCommand}" />
```

```csharp
AddTaskCommand = new RelayCommand(AddTask);
DeleteTaskCommand = new RelayCommand(DeleteSelectedTask, () => SelectedTask != null);
```

- 두 번째 인자 `canExecute`: false면 버튼 disabled (React `disabled={!canDelete}`)
- `CommandManager.RequerySuggested`: UI 포커스 변경 등 때 CanExecute 재평가

---

## 7. Value Converter

ViewModel은 **표시용 문자열/색**을 넣지 않고 enum·bool 같은 **도메인 값**을 유지합니다.  
변환은 Converter 또는 ViewModel 계산 속성에서 합니다.

| Converter | 용도 |
|-----------|------|
| `BoolToVisibilityConverter` | bool → Visible/Collapsed |
| `NullOrEmptyToVisibilityConverter` | empty state UI |
| `TaskStatusLabelConverter` | enum → 한글 라벨 |
| `PriorityToBrushConverter` | enum → 색상 Brush |

XAML:

```xml
Visibility="{Binding IsLoading, Converter={StaticResource BoolToVisibilityConverter}}"
```

---

## 8. UserControl (재사용 컴포넌트)

`Views/TaskCardView.xaml`:

- ListBox의 `ItemTemplate` 안에서 `{Binding}` = 각 `TaskItemViewModel`
- code-behind는 `InitializeComponent()`만

React:

```jsx
function TaskCard({ task }) { return <div>...</div>; }
// tasks.map(task => <TaskCard key={task.id} task={task} />)
```

---

## 9. Styles & Resources

`App.xaml`의 `Application.Resources`:

- **SolidColorBrush**: 색상 토큰 (CSS variables)
- **Style**: TargetType에 기본 Setter (CSS class)
- **StaticResource**: 리소스 딕셔너리 참조

```xml
<Button Style="{StaticResource PrimaryButtonStyle}" />
```

---

## 10. XAML 레이아웃

| 컨트롤 | React/CSS 유사 |
|--------|----------------|
| `Grid` + Row/ColumnDefinitions | CSS Grid |
| `StackPanel` | flex column/row |
| `UniformGrid` | equal-width grid columns |
| `Border` | div + border-radius |
| `ScrollViewer` | overflow: auto (종종 암묵적) |

---

## 11. 추천 학습 순서

코드를 아래 순서로 읽으면 흐름이 잡힙니다.

1. `Models/TaskItem.cs`, `Models/Enums.cs` — 데이터 shape
2. `ViewModels/ViewModelBase.cs` — 변경 알림
3. `ViewModels/RelayCommand.cs` — Command
4. `ViewModels/TaskItemViewModel.cs` — 항목 단위 상태
5. `ViewModels/MainViewModel.cs` — 목록·필터·Command·async
6. `Views/TaskCardView.xaml` — list item UI
7. `App.xaml` — 전역 리소스
8. `MainWindow.xaml` — 전체 레이아웃과 바인딩
9. `MainWindow.xaml.cs` — DataContext 연결

### hands-on 실습 아이디어

1. **우선순위 필터** ComboBox 추가 (`TasksView.Filter` 확장)
2. **정렬** — `TasksView.SortDescriptions`에 `CreatedAt` 내림차순
3. **Undo 삭제** — 삭제 전 백업 후 "실행 취소" Command
4. **Validation** — 제목이 비면 저장 버튼 disabled (이미 `IsValid` 활용)
5. **LocalStorage 대신** JSON 파일 저장 (`System.IO` + `JsonSerializer` 또는 Newtonsoft.Json)

---

## 12. React와 다른 점 (헷갈리기 쉬운 것)

| 항목 | React | WPF |
|------|-------|-----|
| UI 갱신 | setState → re-render | PropertyChanged → 바인딩 갱신 |
| 목록 key | `key={id}` 필수 | `ItemsControl`은 객체 identity 사용 (Model 인스턴스 유지) |
| 스타일 | CSS-in-JS, Tailwind | XAML Style, ControlTemplate |
| 라우팅 | React Router | `NavigationWindow`, Frame, Prism, MVVM Toolkit 등 |
| 테스트 | Jest + RTL | ViewModel 단위 테스트가 주류 (UI는 ViewModel만 테스트) |

---

## 13. 다음 단계

- **CommunityToolkit.Mvvm**: `[ObservableProperty]`, `[RelayCommand]`로 보일러플ATE 감소
- **.NET 8 + WPF**: 최신 SDK, Host builder, DI (`Microsoft.Extensions.DependencyInjection`)
- **LiveCharts / OxyPlot**: 차트
- **Entity Framework**: DB 연동

질문이 생기면 해당 파일 경로와 함께 물어보시면, React 관점에서 이어서 설명할 수 있습니다.
