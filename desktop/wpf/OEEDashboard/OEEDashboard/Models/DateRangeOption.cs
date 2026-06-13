namespace OEEDashboard.Models;

public enum DateRangePreset
{
    Today,
    Last7Days,
    Last30Days
}

public sealed class DateRangeOption
{
    public DateRangePreset Preset { get; init; }
    public string Label { get; init; } = string.Empty;

    public (DateTime From, DateTime To) ResolveRange(DateTime? reference = null)
    {
        var now = reference ?? DateTime.Now;
        var end = now;
        var start = Preset switch
        {
            DateRangePreset.Today => now.Date,
            DateRangePreset.Last7Days => now.Date.AddDays(-6),
            DateRangePreset.Last30Days => now.Date.AddDays(-29),
            _ => now.Date
        };

        return (start, end);
    }
}
