namespace OEEDashboard.Services;

public sealed class ApiSettings
{
    public string BaseUrl { get; init; } = "http://localhost:5080";
    public bool UseMockData { get; init; } = true;
    public int RefreshIntervalSeconds { get; init; } = 30;
}
