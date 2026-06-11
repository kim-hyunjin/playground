# WinForms 학습 가이드

이 문서는 본 프로젝트(`지출 관리` 예제)를 통해 Windows Forms(WinForms)를 체계적으로 학습할 수 있도록 작성되었습니다.

---

## 목차

1. [WinForms란?](#1-winforms란)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [애플리케이션 생명주기](#3-애플리케이션-생명주기)
4. [핵심 개념](#4-핵심-개념)
5. [예제 앱 기능 설명](#5-예제-앱-기능-설명)
6. [자주 쓰는 컨트롤](#6-자주-쓰는-컨트롤)
7. [레이아웃과 디자이너](#7-레이아웃과-디자이너)
8. [데이터 바인딩](#8-데이터-바인딩)
9. [이벤트 처리](#9-이벤트-처리)
10. [대화상자와 파일 I/O](#10-대화상자와-파일-io)
11. [WinForms vs WPF](#11-winforms-vs-wpf)
12. [실무 팁과 다음 단계](#12-실무-팁과-다음-단계)

---

## 1. WinForms란?

**Windows Forms(WinForms)** 는 Microsoft가 .NET Framework 초기부터 제공한 **데스크톱 GUI 프레임워크**입니다.

| 항목 | 설명 |
|------|------|
| 첫 출시 | .NET Framework 1.0 (2002년) |
| 기반 기술 | GDI+ (그래픽), Win32 API (윈도우 메시지) |
| 언어 | C#, VB.NET 등 |
| UI 정의 | Visual Studio 디자이너 + 코드 (`.Designer.cs`) |
| 패러다임 | **이벤트 기반** 절차적/객체지향 프로그래밍 |

WinForms는 **버튼, 텍스트박스, 그리드** 같은 UI 요소를 `System.Windows.Forms` 네임스페이스의 **컨트롤(Control)** 로 다룹니다. 사용자가 버튼을 클릭하면 `Click` 이벤트가 발생하고, 개발자가 등록한 **이벤트 핸들러** 메서드가 실행됩니다.

### 언제 WinForms를 선택하나?

- 사내 **레거시 도구**, **관리자 유틸리티**, **간단한 CRUD** 앱
- 빠른 프로토타이핑, Visual Studio 디자이너에 익숙한 팀
- .NET Framework 4.x 환경 유지보수
- WPF보다 **가볍고 학습 곡선이 낮은** UI가 필요할 때

---

## 2. 프로젝트 구조

```
WindowsFormsApp1/
├── Program.cs                 # 앱 진입점 (Main 메서드)
├── MainForm.cs                # 메인 화면 로직
├── MainForm.Designer.cs       # 메인 화면 UI 정의 (디자이너 생성 코드)
├── ExpenseEditForm.cs         # 추가/수정 대화상자 로직
├── ExpenseEditForm.Designer.cs
├── Models/
│   └── ExpenseItem.cs         # 데이터 모델
├── Services/
│   └── ExpenseRepository.cs   # 데이터 저장·조회·파일 I/O
└── Properties/                # 어셈블리 정보, 설정, 리소스
```

### Partial Class 패턴

WinForms의 폼은 **하나의 클래스가 두 파일로 나뉩니다.**

| 파일 | 역할 |
|------|------|
| `MainForm.cs` | 이벤트 핸들러, 비즈니스 로직 (개발자가 주로 편집) |
| `MainForm.Designer.cs` | `InitializeComponent()`, 컨트롤 필드 선언 (디자이너가 생성) |

Visual Studio에서 폼을 드래그앤드롭으로 편집하면 `Designer.cs`가 자동 갱신됩니다. **디자이너가 생성한 `InitializeComponent()` 내부는 수동 수정을 피하는 것이 좋습니다.**

---

## 3. 애플리케이션 생명주기

```csharp
[STAThread]
static void Main()
{
    Application.EnableVisualStyles();
    Application.SetCompatibleTextRenderingDefault(false);
    Application.Run(new MainForm());
}
```

### 흐름도

```
Main() 호출
    ↓
Application.Run(폼) — Windows 메시지 루프 시작
    ↓
폼 Load 이벤트 → 초기화 코드 실행
    ↓
사용자 입력 (클릭, 키 입력 등) → 이벤트 핸들러 실행
    ↓
폼 Close → FormClosing → Dispose
    ↓
메시지 루프 종료 → 프로세스 종료
```

- **`[STAThread]`**: 클립보드, OLE 드래그앤드롭 등 COM 연동에 필요한 스레드 모델
- **`Application.Run`**: UI 스레드에서 Windows 메시지를 계속 처리하는 **메시지 루프**

---

## 4. 핵심 개념

### 4.1 Form (폼)

모든 윈도우의 기본 클래스입니다. `Form`은 `Control`을 상속하며, 제목 표시줄, 크기 조절, 모달 표시 등을 담당합니다.

```csharp
public partial class MainForm : Form { }
```

### 4.1 Control (컨트롤)

버튼, 라벨, 텍스트박스 등 UI 요소의 공통 기반 클래스입니다.

주요 속성:
- `Text` — 표시 문자열
- `Location`, `Size` — 위치와 크기 (픽셀 단위)
- `Visible`, `Enabled` — 표시/활성화 여부
- `Name` — 디자이너/코드에서 참조하는 이름

### 4.3 이벤트 (Event)

WinForms는 **옵저버 패턴** 기반입니다.

```csharp
// 디자이너에서 자동 연결
this.btnAdd.Click += new EventHandler(this.btnAdd_Click);

// 코드에서 연결
btnAdd.Click += btnAdd_Click;
```

### 4.4 컨테이너와 Dock

- `Panel`, `GroupBox`, `TabControl` — 자식 컨트롤을 담는 컨테이너
- `Dock = DockStyle.Fill` — 남은 공간을 채움 (실무에서 가장 많이 사용)
- `Anchor` — 폼 크기 변경 시 특정 변에 고정

본 예제에서 `DataGridView`는 `Dock = Fill`, 필터 영역은 `Dock = Top` 입니다.

---

## 5. 예제 앱 기능 설명

**지출 관리 앱**은 실무에서 흔한 **목록 CRUD + 필터 + 파일 저장** 패턴을 다룹니다.

| 기능 | 학습 포인트 | 관련 파일 |
|------|-------------|-----------|
| 지출 목록 표시 | `DataGridView` + `BindingSource` | `MainForm.cs` |
| 추가/수정/삭제 | 모달 폼, `DialogResult` | `ExpenseEditForm.cs` |
| 카테고리·기간·키워드 필터 | LINQ, UI → Repository | `ExpenseRepository.Filter` |
| 파일 저장/열기 | `SaveFileDialog`, `OpenFileDialog`, XML | `ExpenseRepository` |
| 입력 검증 | `ErrorProvider` | `ExpenseEditForm.cs` |
| 메뉴·단축키 | `MenuStrip`, `ShortcutKeys` | `MainForm.Designer.cs` |
| 상태 표시줄 | `StatusStrip`, `Timer` | `MainForm.cs` |

### 실행 방법

1. Visual Studio에서 `WindowsFormsApp1.slnx` 열기
2. F5 (디버그 실행) 또는 Ctrl+F5 (디버그 없이 실행)

---

## 6. 자주 쓰는 컨트롤

| 컨트롤 | 용도 | 예제에서의 사용 |
|--------|------|-----------------|
| `Label` | 읽기 전용 텍스트 | 필터 라벨, 합계 표시 |
| `TextBox` | 한 줄 텍스트 입력 | 검색어, 내용, 금액 |
| `Button` | 클릭 액션 | 추가, 수정, 삭제, 검색 |
| `ComboBox` | 목록에서 선택 | 카테고리 필터/입력 |
| `DateTimePicker` | 날짜 선택 | 기간 필터, 지출 날짜 |
| `DataGridView` | 표 형태 데이터 | 지출 목록 |
| `MenuStrip` | 상단 메뉴 | 파일, 도움말 |
| `StatusStrip` | 하단 상태줄 | 건수, 파일명, 시각 |
| `Panel` | 영역 구분·레이아웃 | 필터, 버튼 영역 |
| `ErrorProvider` | 입력 오류 표시 | 폼 검증 |
| `Timer` | 주기적 작업 | 시각 갱신 |

---

## 7. 레이아웃과 디자이너

### Visual Studio 디자이너

1. 솔루션 탐색기에서 `MainForm.cs` 더블클릭 → 디자인 뷰
2. 도구 상자에서 컨트롤을 폼에 드래그
3. 속성 창에서 `Name`, `Text`, `Dock` 등 설정
4. 이벤트 탭에서 `Click` 등 연결 → 핸들러 코드 자동 생성

### 픽셀 기반 레이아웃의 한계

WinForms는 기본적으로 **절대 좌표(픽셀)** 로 배치됩니다. `Dock`/`Anchor`/`TableLayoutPanel`로 반응형에 가깝게 만들 수 있지만, WPF처럼 유연한 비율 레이아웃은 구현이 더 번거롭습니다.

---

## 8. 데이터 바인딩

WinForms의 데이터 바인딩은 WPF보다 단순하고 **수동 갱신이 많습니다.**

### BindingSource 패턴 (본 예제)

```csharp
private readonly BindingSource _bindingSource = new BindingSource();

// 초기화
dgvExpenses.AutoGenerateColumns = false;
dgvExpenses.DataSource = _bindingSource;

// 데이터 갱신
_bindingSource.DataSource = filteredList;
_bindingSource.ResetBindings(false);
```

`DataGridView` 열의 `DataPropertyName`을 모델 속성명(`Date`, `Category` 등)과 맞춥니다.

### WPF와의 차이

- WinForms: `INotifyPropertyChanged` 없이도 동작하지만, **목록 변경 시 `ResetBindings` 호출**이 필요
- WPF: `ObservableCollection`, 양방향 바인딩, `IValueConverter`로 UI가 자동 갱신

---

## 9. 이벤트 처리

### 대표 이벤트

| 이벤트 | 발생 시점 |
|--------|-----------|
| `Load` | 폼이 처음 표시되기 직전 |
| `Click` | 마우스 클릭 |
| `KeyDown` | 키 누름 (Enter 검색 등) |
| `FormClosing` | 폼 닫기 시도 |
| `CellDoubleClick` | 그리드 셀 더블클릭 |

### 모달 vs 모달리스

```csharp
// 모달 — 닫을 때까지 부모 폼 비활성
if (dialog.ShowDialog(this) == DialogResult.OK) { ... }

// 모달리스 — 동시에 여러 창 조작 가능
var form = new SomeForm();
form.Show();
```

---

## 10. 대화상자와 파일 I/O

### 내장 대화상자

| 클래스 | 용도 |
|--------|------|
| `MessageBox` | 알림, 확인/취소 |
| `OpenFileDialog` | 파일 열기 |
| `SaveFileDialog` | 파일 저장 |
| `FolderBrowserDialog` | 폴더 선택 |

`using` 문으로 감싸면 `Dispose`가 자동 호출됩니다.

### 파일 저장 (예제)

`ExpenseRepository`는 .NET 내장 `XmlSerializer`로 목록을 XML 파일에 저장합니다. JSON이 필요하면 `System.Text.Json`( .NET Core+ ) 또는 Newtonsoft.Json을 추가할 수 있습니다.

---

## 11. WinForms vs WPF

WPF(Windows Presentation Foundation)는 WinForms 다음 세대의 Windows 데스크톱 UI 프레임워크입니다. 같은 C#/.NET 생태계이지만 **설계 철학이 크게 다릅니다.**

### 비교 표

| 항목 | WinForms | WPF |
|------|----------|-----|
| **출시** | 2002 (.NET 1.0) | 2006 (.NET 3.0) |
| **렌더링** | GDI+ (비트맵 기반) | DirectX / 벡터 기반 |
| **UI 정의** | C# Designer 코드 (`.Designer.cs`) | XAML (선언적 마크업) |
| **레이아웃** | 픽셀, Dock, Anchor | Grid, StackPanel, 비율·정렬 유연 |
| **데이터 바인딩** | 단순 (`BindingSource`) | 강력 (양방향, 커맨드, Converter) |
| **스타일/테마** | 제한적, OS 테마 의존 | ResourceDictionary, ControlTemplate |
| **애니메이션** | 거의 없음 (Timer + 수동) | Storyboard, 내장 지원 |
| **MVVM** | 가능하나 비표준, 코드비하인드 일반 | MVVM이 표준 패턴 |
| **학습 곡선** | 낮음 | 높음 (XAML + 바인딩) |
| **HiDPI** | 상대적으로 약함 | 상대적으로 우수 |
| **크로스 플랫폼** | Windows 전용 | Windows 전용 (MAUI가 후속) |
| **적합한 경우** | 레거시, 내부 도구, 빠른 개발 | 풍부한 UI, 복잡한 바인딩, 현대적 UX |

### 아키텍처 관점

```
WinForms                          WPF
────────                          ───
Form (코드비하인드)                Window + XAML
  ↓ 이벤트 핸들러에서 직접 조작      ↓ ViewModel (MVVM)
  ↓                                ↓ 데이터 바인딩
Control.Text = "...";              <TextBox Text="{Binding Name}" />
```

**WinForms**: UI와 로직이 폼 클래스에 함께 있는 **코드비하인드** 패턴이 일반적입니다.

**WPF**: UI(XAML)와 로직(ViewModel)을 분리하는 **MVVM**이 권장됩니다. 테스트와 유지보수에 유리합니다.

### 같은 기능을 다르게 구현할 때

| 작업 | WinForms | WPF |
|------|----------|-----|
| 목록 표시 | `DataGridView` + `BindingSource` | `DataGrid` + `ItemsSource` 바인딩 |
| 입력 검증 | `ErrorProvider`, `Validating` 이벤트 | `ValidationRule`, `IDataErrorInfo` |
| 버튼 명령 | `Click` 이벤트 | `ICommand` / `RelayCommand` |
| 날짜 형식 | `DataBindingComplete`에서 수동 포맷 | `StringFormat` 또는 `IValueConverter` |
| 다이얼로그 | `Form.ShowDialog()` | `Window.ShowDialog()` |

### 무엇을 배워야 할까?

- **WinForms**: 레거시 유지보수, 빠른 사내 도구, .NET Framework 현장
- **WPF**: 새 Windows 데스크톱 앱, 복잡한 UI, MVVM 패턴
- 둘 다 익히면 **같은 문제를 두 방식으로 비교**하며 UI 프레임워크 이해가 깊어집니다.

본 저장소의 `WpfTodoApp`과 이 `WindowsFormsApp1`을 나란히 보면 차이를 체감하기 좋습니다.

---

## 12. 실무 팁과 다음 단계

### 실무 팁

1. **UI 스레드 규칙**: 컨트롤은 생성한 UI 스레드에서만 접근. 백그라운드 작업 후 UI 갱신은 `Control.Invoke` / `BeginInvoke` 사용
2. **using으로 폼·다이얼로그 정리**: `using (var dlg = new ExpenseEditForm())` 패턴 유지
3. **비즈니스 로직 분리**: 폼에 모든 코드를 넣지 말고 `Services`, `Models`로 분리 (본 예제 참고)
4. **Designer.cs 보호**: 레이아웃 변경은 Visual Studio 디자이너 사용 권장

### 학습 순서 제안

1. 예제 실행 후 **추가·수정·삭제·저장** 직접 사용
2. `MainForm.cs`의 이벤트 핸들러를 한 줄씩 읽으며 흐름 파악
3. Visual Studio 디자이너로 버튼 하나 추가해 보기
4. `ExpenseRepository`에 **JSON 저장** 옵션 추가해 보기
5. `ContextMenuStrip`으로 그리드 우클릭 메뉴 추가해 보기
6. 같은 앱을 WPF로 포팅하며 [11장](#11-winforms-vs-wpf) 비교표 다시 검토

### 참고 자료

- [Windows Forms 문서 (Microsoft Learn)](https://learn.microsoft.com/dotnet/desktop/winforms/)
- [WPF 소개 (Microsoft Learn)](https://learn.microsoft.com/dotnet/desktop/wpf/overview/)
- [.NET 데스크톱 가이드](https://learn.microsoft.com/dotnet/desktop/)

---

## 부록: 예제 코드 읽기 순서

1. `Program.cs` — 앱이 어떻게 시작하는지
2. `Models/ExpenseItem.cs` — 데이터 구조
3. `Services/ExpenseRepository.cs` — 데이터 조작·저장
4. `MainForm.Designer.cs` — UI 구성 (어떤 컨트롤이 있는지)
5. `MainForm.cs` — `Load`, CRUD, 필터, 메뉴 이벤트
6. `ExpenseEditForm.cs` — 모달 대화상자·검증 패턴

이 순서대로 읽으면 WinForms 앱의 전형적인 구조를 한 번에 파악할 수 있습니다.
