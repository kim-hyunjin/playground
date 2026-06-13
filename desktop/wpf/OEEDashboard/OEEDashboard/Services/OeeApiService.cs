using System.Net.Http;
using System.Net.Http.Json;
using OEEDashboard.Models;

namespace OEEDashboard.Services;

public sealed class OeeApiService : IOeeApiService
{
    private readonly HttpClient _httpClient;

    public OeeApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Task<IReadOnlyList<ProductionLine>> GetLinesAsync(CancellationToken cancellationToken = default)
        => GetAsync<IReadOnlyList<ProductionLine>>("/api/lines", cancellationToken);

    public Task<OeeSummary> GetSummaryAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default)
        => GetAsync<OeeSummary>($"/api/oee/summary?lineId={Uri.EscapeDataString(lineId)}&from={from:O}&to={to:O}", cancellationToken);

    public Task<IReadOnlyList<EquipmentOee>> GetEquipmentOeeAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default)
        => GetAsync<IReadOnlyList<EquipmentOee>>($"/api/oee/equipment?lineId={Uri.EscapeDataString(lineId)}&from={from:O}&to={to:O}", cancellationToken);

    public Task<IReadOnlyList<OeeTrendPoint>> GetTrendAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default)
        => GetAsync<IReadOnlyList<OeeTrendPoint>>($"/api/oee/trend?lineId={Uri.EscapeDataString(lineId)}&from={from:O}&to={to:O}", cancellationToken);

    public Task<IReadOnlyList<DowntimeReason>> GetDowntimeReasonsAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default)
        => GetAsync<IReadOnlyList<DowntimeReason>>($"/api/downtime/reasons?lineId={Uri.EscapeDataString(lineId)}&from={from:O}&to={to:O}", cancellationToken);

    public Task<IReadOnlyList<AlarmEvent>> GetActiveAlarmsAsync(
        string lineId,
        CancellationToken cancellationToken = default)
        => GetAsync<IReadOnlyList<AlarmEvent>>($"/api/alarms/active?lineId={Uri.EscapeDataString(lineId)}", cancellationToken);

    private async Task<T> GetAsync<T>(string path, CancellationToken cancellationToken)
    {
        var response = await _httpClient.GetAsync(path, cancellationToken);
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<T>(cancellationToken: cancellationToken);
        return result ?? throw new InvalidOperationException($"Empty response from {path}");
    }
}
