namespace OEEDashboard.Models;

public sealed class DowntimeReason
{
    public string ReasonCode { get; init; } = string.Empty;
    public string ReasonName { get; init; } = string.Empty;
    public int Minutes { get; init; }
    public int EventCount { get; init; }
}
