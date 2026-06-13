using System.Collections.ObjectModel;
using System.Windows.Input;
using System.Windows.Threading;
using LiveChartsCore;
using LiveChartsCore.SkiaSharpView;
using LiveChartsCore.SkiaSharpView.Painting;
using OEEDashboard.Models;
using OEEDashboard.Services;
using SkiaSharp;

namespace OEEDashboard.ViewModels;

public sealed class MainViewModel : ViewModelBase, IDisposable
{
    private readonly IOeeApiService _apiService;
    private readonly ApiSettings _settings;
    private readonly DispatcherTimer _refreshTimer;
    private CancellationTokenSource? _loadCts;

    private ProductionLine? _selectedLine;
    private DateRangeOption? _selectedDateRange;
    private bool _isLoading;
    private string _statusMessage = "준비됨";
    private string _lastUpdatedText = string.Empty;
    private string _dataSourceLabel = string.Empty;

    public MainViewModel(IOeeApiService apiService, ApiSettings settings, IEnumerable<DateRangeOption> dateRangeOptions)
    {
        _apiService = apiService;
        _settings = settings;

        foreach (var option in dateRangeOptions)
        {
            DateRangeOptions.Add(option);
        }

        OeeKpi = new KpiCardViewModel { Title = "OEE" };
        AvailabilityKpi = new KpiCardViewModel { Title = "가동률" };
        PerformanceKpi = new KpiCardViewModel { Title = "성능" };
        QualityKpi = new KpiCardViewModel { Title = "품질" };

        RefreshCommand = new RelayCommand(async () => await RefreshAsync(), () => !IsLoading && SelectedLine is not null);

        _refreshTimer = new DispatcherTimer
        {
            Interval = TimeSpan.FromSeconds(Math.Max(_settings.RefreshIntervalSeconds, 5))
        };
        _refreshTimer.Tick += async (_, _) => await RefreshAsync(silent: true);
    }

    public ObservableCollection<ProductionLine> Lines { get; } = [];
    public ObservableCollection<DateRangeOption> DateRangeOptions { get; } = [];
    public ObservableCollection<AlarmEvent> Alarms { get; } = [];

    public KpiCardViewModel OeeKpi { get; }
    public KpiCardViewModel AvailabilityKpi { get; }
    public KpiCardViewModel PerformanceKpi { get; }
    public KpiCardViewModel QualityKpi { get; }

    public ISeries[] EquipmentOeeSeries { get; private set; } = [];
    public Axis[] EquipmentOeeXAxes { get; private set; } = [];
    public Axis[] EquipmentOeeYAxes { get; private set; } = [];

    public ISeries[] TrendSeries { get; private set; } = [];
    public Axis[] TrendXAxes { get; private set; } = [];
    public Axis[] TrendYAxes { get; private set; } = [];

    public ISeries[] DowntimeSeries { get; private set; } = [];
    public Axis[] DowntimeXAxes { get; private set; } = [];
    public Axis[] DowntimeYAxes { get; private set; } = [];

    public ProductionLine? SelectedLine
    {
        get => _selectedLine;
        set
        {
            if (!SetProperty(ref _selectedLine, value))
            {
                return;
            }

            _ = RefreshAsync();
        }
    }

    public DateRangeOption? SelectedDateRange
    {
        get => _selectedDateRange;
        set
        {
            if (!SetProperty(ref _selectedDateRange, value))
            {
                return;
            }

            if (SelectedLine is not null)
            {
                _ = RefreshAsync();
            }
        }
    }

    public bool IsLoading
    {
        get => _isLoading;
        private set
        {
            if (SetProperty(ref _isLoading, value))
            {
                ((RelayCommand)RefreshCommand).RaiseCanExecuteChanged();
                OnPropertyChanged(nameof(IsNotLoading));
            }
        }
    }

    public bool IsNotLoading => !IsLoading;

    public string StatusMessage
    {
        get => _statusMessage;
        private set => SetProperty(ref _statusMessage, value);
    }

    public string LastUpdatedText
    {
        get => _lastUpdatedText;
        private set => SetProperty(ref _lastUpdatedText, value);
    }

    public string DataSourceLabel
    {
        get => _dataSourceLabel;
        private set => SetProperty(ref _dataSourceLabel, value);
    }

    public ICommand RefreshCommand { get; }

    public async Task InitializeAsync()
    {
        DataSourceLabel = _settings.UseMockData
            ? "Mock API (appsettings.json → Api:UseMockData)"
            : $"REST API ({_settings.BaseUrl})";

        try
        {
            IsLoading = true;
            StatusMessage = "라인 목록 불러오는 중...";

            var lines = await _apiService.GetLinesAsync();
            Lines.Clear();
            foreach (var line in lines)
            {
                Lines.Add(line);
            }

            SelectedDateRange = DateRangeOptions.FirstOrDefault();
            SelectedLine = Lines.FirstOrDefault();

            _refreshTimer.Start();
        }
        catch (Exception ex)
        {
            StatusMessage = $"초기화 실패: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }

    public async Task RefreshAsync(bool silent = false)
    {
        if (SelectedLine is null || SelectedDateRange is null)
        {
            return;
        }

        _loadCts?.Cancel();
        _loadCts = new CancellationTokenSource();
        var token = _loadCts.Token;

        try
        {
            IsLoading = true;
            if (!silent)
            {
                StatusMessage = "데이터 갱신 중...";
            }

            var (from, to) = SelectedDateRange.ResolveRange();

            var summaryTask = _apiService.GetSummaryAsync(SelectedLine.Id, from, to, token);
            var equipmentTask = _apiService.GetEquipmentOeeAsync(SelectedLine.Id, from, to, token);
            var trendTask = _apiService.GetTrendAsync(SelectedLine.Id, from, to, token);
            var downtimeTask = _apiService.GetDowntimeReasonsAsync(SelectedLine.Id, from, to, token);
            var alarmsTask = _apiService.GetActiveAlarmsAsync(SelectedLine.Id, token);

            await Task.WhenAll(summaryTask, equipmentTask, trendTask, downtimeTask, alarmsTask);

            ApplySummary(await summaryTask);
            ApplyEquipmentChart(await equipmentTask);
            ApplyTrendChart(await trendTask, from, to);
            ApplyDowntimeChart(await downtimeTask);
            ApplyAlarms(await alarmsTask);

            LastUpdatedText = $"마지막 갱신: {DateTime.Now:HH:mm:ss}";
            StatusMessage = $"{SelectedLine.Name} · {SelectedDateRange.Label} 데이터 표시 중";
        }
        catch (OperationCanceledException)
        {
            // Ignore stale refresh requests.
        }
        catch (Exception ex)
        {
            StatusMessage = $"API 오류: {ex.Message}";
        }
        finally
        {
            IsLoading = false;
        }
    }

    private void ApplySummary(OeeSummary summary)
    {
        OeeKpi.Value = $"{summary.Oee:F1}%";
        OeeKpi.Percent = summary.Oee;
        OeeKpi.Subtitle = $"목표 {summary.TargetOee:F0}%";

        AvailabilityKpi.Value = $"{summary.Availability:F1}%";
        AvailabilityKpi.Percent = summary.Availability;
        AvailabilityKpi.Subtitle = "Availability";

        PerformanceKpi.Value = $"{summary.Performance:F1}%";
        PerformanceKpi.Percent = summary.Performance;
        PerformanceKpi.Subtitle = "Performance";

        QualityKpi.Value = $"{summary.Quality:F1}%";
        QualityKpi.Percent = summary.Quality;
        QualityKpi.Subtitle = $"양품 {summary.TotalGoodUnits:N0} / 불량 {summary.TotalDefectUnits:N0}";
    }

    private void ApplyEquipmentChart(IReadOnlyList<EquipmentOee> equipment)
    {
        var values = equipment.Select(e => (double)e.Oee).ToArray();
        var labels = equipment.Select(e => e.EquipmentName).ToArray();

        EquipmentOeeSeries =
        [
            new ColumnSeries<double>
            {
                Name = "OEE %",
                Values = values,
                Fill = new SolidColorPaint(SKColor.Parse("#2563EB")),
                MaxBarWidth = 48
            }
        ];

        EquipmentOeeXAxes =
        [
            new Axis
            {
                Labels = labels,
                LabelsRotation = 15,
                TextSize = 12
            }
        ];

        EquipmentOeeYAxes =
        [
            new Axis
            {
                MinLimit = 0,
                MaxLimit = 100,
                Labeler = value => $"{value:F0}%"
            }
        ];

        OnPropertyChanged(nameof(EquipmentOeeSeries));
        OnPropertyChanged(nameof(EquipmentOeeXAxes));
        OnPropertyChanged(nameof(EquipmentOeeYAxes));
    }

    private void ApplyTrendChart(IReadOnlyList<OeeTrendPoint> points, DateTime from, DateTime to)
    {
        var isHourly = (to - from).TotalDays <= 1.5;
        var labels = points
            .Select(p => isHourly ? p.Timestamp.ToString("HH:mm") : p.Timestamp.ToString("MM/dd"))
            .ToArray();

        TrendSeries =
        [
            new LineSeries<double>
            {
                Name = "OEE",
                Values = points.Select(p => p.Oee).ToArray(),
                Stroke = new SolidColorPaint(SKColor.Parse("#2563EB"), 3),
                Fill = null,
                GeometrySize = 6
            },
            new LineSeries<double>
            {
                Name = "가동률",
                Values = points.Select(p => p.Availability).ToArray(),
                Stroke = new SolidColorPaint(SKColor.Parse("#16A34A"), 2),
                Fill = null,
                GeometrySize = 0
            },
            new LineSeries<double>
            {
                Name = "성능",
                Values = points.Select(p => p.Performance).ToArray(),
                Stroke = new SolidColorPaint(SKColor.Parse("#D97706"), 2),
                Fill = null,
                GeometrySize = 0
            }
        ];

        TrendXAxes =
        [
            new Axis
            {
                Labels = labels,
                LabelsRotation = isHourly ? 0 : 15,
                TextSize = 11
            }
        ];

        TrendYAxes =
        [
            new Axis
            {
                MinLimit = 0,
                MaxLimit = 100,
                Labeler = value => $"{value:F0}%"
            }
        ];

        OnPropertyChanged(nameof(TrendSeries));
        OnPropertyChanged(nameof(TrendXAxes));
        OnPropertyChanged(nameof(TrendYAxes));
    }

    private void ApplyDowntimeChart(IReadOnlyList<DowntimeReason> reasons)
    {
        var values = reasons.Select(r => (double)r.Minutes).ToArray();
        var labels = reasons.Select(r => r.ReasonName).ToArray();

        DowntimeSeries =
        [
            new RowSeries<double>
            {
                Name = "정지 시간(분)",
                Values = values,
                Fill = new SolidColorPaint(SKColor.Parse("#DC2626")),
                MaxBarWidth = 22
            }
        ];

        DowntimeXAxes =
        [
            new Axis
            {
                MinLimit = 0,
                Labeler = value => $"{value:F0}분"
            }
        ];

        DowntimeYAxes =
        [
            new Axis
            {
                Labels = labels,
                TextSize = 12
            }
        ];

        OnPropertyChanged(nameof(DowntimeSeries));
        OnPropertyChanged(nameof(DowntimeXAxes));
        OnPropertyChanged(nameof(DowntimeYAxes));
    }

    private void ApplyAlarms(IReadOnlyList<AlarmEvent> alarms)
    {
        Alarms.Clear();
        foreach (var alarm in alarms.OrderByDescending(a => a.OccurredAt))
        {
            Alarms.Add(alarm);
        }
    }

    public void Dispose()
    {
        _refreshTimer.Stop();
        _loadCts?.Cancel();
        _loadCts?.Dispose();
    }
}
