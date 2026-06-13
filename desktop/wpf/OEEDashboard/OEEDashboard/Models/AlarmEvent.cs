namespace OEEDashboard.Models;

public enum AlarmSeverity
{
    Info,
    Warning,
    Critical
}

public sealed class AlarmEvent
{
    public string Id { get; init; } = string.Empty;
    public DateTime OccurredAt { get; init; }
    public string EquipmentName { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public AlarmSeverity Severity { get; init; }
    public bool IsAcknowledged { get; init; }
}
