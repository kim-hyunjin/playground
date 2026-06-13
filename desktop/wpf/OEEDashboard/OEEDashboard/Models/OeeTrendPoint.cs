namespace OEEDashboard.Models;

public sealed class OeeTrendPoint
{
    public DateTime Timestamp { get; init; }
    public double Oee { get; init; }
    public double Availability { get; init; }
    public double Performance { get; init; }
    public double Quality { get; init; }
}
