namespace OEEDashboard.ViewModels;

public sealed class KpiCardViewModel : ViewModelBase
{
    private string _title = string.Empty;
    private string _value = "-";
    private string _subtitle = string.Empty;
    private double _percent;

    public string Title
    {
        get => _title;
        set => SetProperty(ref _title, value);
    }

    public string Value
    {
        get => _value;
        set => SetProperty(ref _value, value);
    }

    public string Subtitle
    {
        get => _subtitle;
        set => SetProperty(ref _subtitle, value);
    }

    public double Percent
    {
        get => _percent;
        set => SetProperty(ref _percent, value);
    }
}
