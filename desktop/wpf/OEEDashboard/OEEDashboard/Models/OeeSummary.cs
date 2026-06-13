namespace OEEDashboard.Models;

public sealed class OeeSummary
{
    public double Oee { get; init; }
    public double Availability { get; init; }
    public double Performance { get; init; }
    public double Quality { get; init; }
    public double TargetOee { get; init; }
    public int TotalGoodUnits { get; init; }
    public int TotalDefectUnits { get; init; }
}
