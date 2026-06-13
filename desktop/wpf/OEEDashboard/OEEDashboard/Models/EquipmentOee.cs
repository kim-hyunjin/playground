namespace OEEDashboard.Models;

public sealed class EquipmentOee
{
    public string EquipmentId { get; init; } = string.Empty;
    public string EquipmentName { get; init; } = string.Empty;
    public double Oee { get; init; }
    public double Availability { get; init; }
    public double Performance { get; init; }
    public double Quality { get; init; }
}
