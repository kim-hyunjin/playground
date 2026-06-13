using System.Net.Http;
using Microsoft.Extensions.Configuration;
using OEEDashboard.Models;

namespace OEEDashboard.Services;

public static class ServiceFactory
{
    public static ApiSettings LoadSettings()
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .Build();

        var settings = new ApiSettings();
        configuration.GetSection("Api").Bind(settings);
        return settings;
    }

    public static IOeeApiService CreateOeeApiService(ApiSettings settings)
    {
        if (settings.UseMockData)
        {
            return new MockOeeApiService();
        }

        var httpClient = new HttpClient
        {
            BaseAddress = new Uri(settings.BaseUrl.TrimEnd('/') + "/"),
            Timeout = TimeSpan.FromSeconds(15)
        };

        return new OeeApiService(httpClient);
    }

    public static IReadOnlyList<DateRangeOption> CreateDateRangeOptions() =>
    [
        new() { Preset = DateRangePreset.Today, Label = "오늘" },
        new() { Preset = DateRangePreset.Last7Days, Label = "최근 7일" },
        new() { Preset = DateRangePreset.Last30Days, Label = "최근 30일" }
    ];
}
