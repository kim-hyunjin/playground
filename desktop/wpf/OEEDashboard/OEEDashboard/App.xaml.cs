using System.Windows;
using OEEDashboard.Services;
using OEEDashboard.ViewModels;

namespace OEEDashboard;

public partial class App : Application
{
    protected override async void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        var settings = ServiceFactory.LoadSettings();
        var apiService = ServiceFactory.CreateOeeApiService(settings);
        var viewModel = new MainViewModel(apiService, settings, ServiceFactory.CreateDateRangeOptions());

        var window = new MainWindow
        {
            DataContext = viewModel
        };

        window.Closed += (_, _) => viewModel.Dispose();
        MainWindow = window;
        window.Show();

        await viewModel.InitializeAsync();
    }
}
