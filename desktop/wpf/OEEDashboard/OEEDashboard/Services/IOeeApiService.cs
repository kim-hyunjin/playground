using OEEDashboard.Models;

namespace OEEDashboard.Services;

public interface IOeeApiService
{
    Task<IReadOnlyList<ProductionLine>> GetLinesAsync(CancellationToken cancellationToken = default);

    Task<OeeSummary> GetSummaryAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<EquipmentOee>> GetEquipmentOeeAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OeeTrendPoint>> GetTrendAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DowntimeReason>> GetDowntimeReasonsAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AlarmEvent>> GetActiveAlarmsAsync(
        string lineId,
        CancellationToken cancellationToken = default);
}
