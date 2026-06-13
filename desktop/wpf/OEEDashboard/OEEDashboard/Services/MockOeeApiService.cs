using OEEDashboard.Models;

namespace OEEDashboard.Services;

/// <summary>
/// REST API가 없을 때 사용하는 시뮬레이션 서비스.
/// 응답 형태는 실제 API와 동일하게 유지합니다.
/// </summary>
public sealed class MockOeeApiService : IOeeApiService
{
    private static readonly ProductionLine[] Lines =
    [
        new() { Id = "A", Name = "A라인 (조립)" },
        new() { Id = "B", Name = "B라인 (도장)" },
        new() { Id = "C", Name = "C라인 (검사)" }
    ];

    public Task<IReadOnlyList<ProductionLine>> GetLinesAsync(CancellationToken cancellationToken = default)
        => Task.FromResult<IReadOnlyList<ProductionLine>>(Lines);

    public Task<OeeSummary> GetSummaryAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default)
    {
        var seed = HashCode.Combine(lineId, from.Date, to.Date);
        var random = new Random(seed);

        var availability = 78 + random.NextDouble() * 15;
        var performance = 72 + random.NextDouble() * 18;
        var quality = 88 + random.NextDouble() * 10;
        var oee = availability * performance * quality / 10_000;

        var summary = new OeeSummary
        {
            Oee = Math.Round(oee, 1),
            Availability = Math.Round(availability, 1),
            Performance = Math.Round(performance, 1),
            Quality = Math.Round(quality, 1),
            TargetOee = 75,
            TotalGoodUnits = random.Next(800, 1500),
            TotalDefectUnits = random.Next(20, 120)
        };

        return Task.FromResult(summary);
    }

    public Task<IReadOnlyList<EquipmentOee>> GetEquipmentOeeAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default)
    {
        var equipmentNames = lineId switch
        {
            "A" => new[] { "조립로봇 #1", "조립로봇 #2", "컨베이어", "체결기" },
            "B" => new[] { "도장부스 #1", "건조로", "컨베이어", "UV경화" },
            "C" => new[] { "비전검사 #1", "비전검사 #2", "분류기", "포장기" },
            _ => new[] { "설비 #1", "설비 #2", "설비 #3", "설비 #4" }
        };

        var random = new Random(HashCode.Combine(lineId, 42));
        var list = equipmentNames.Select((name, index) =>
        {
            var availability = 70 + random.NextDouble() * 25;
            var performance = 65 + random.NextDouble() * 30;
            var quality = 85 + random.NextDouble() * 12;
            var oee = availability * performance * quality / 10_000;

            return new EquipmentOee
            {
                EquipmentId = $"{lineId}-{index + 1}",
                EquipmentName = name,
                Oee = Math.Round(oee, 1),
                Availability = Math.Round(availability, 1),
                Performance = Math.Round(performance, 1),
                Quality = Math.Round(quality, 1)
            };
        }).ToList();

        return Task.FromResult<IReadOnlyList<EquipmentOee>>(list);
    }

    public Task<IReadOnlyList<OeeTrendPoint>> GetTrendAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default)
    {
        var span = to - from;
        var pointCount = span.TotalDays <= 1.5 ? 24 : span.TotalDays <= 8 ? 7 : 30;
        var step = span / Math.Max(pointCount - 1, 1);
        var random = new Random(HashCode.Combine(lineId, from.Date));

        var points = new List<OeeTrendPoint>();
        var timestamp = from;

        for (var i = 0; i < pointCount; i++)
        {
            var availability = 75 + random.NextDouble() * 18 + Math.Sin(i * 0.6) * 4;
            var performance = 70 + random.NextDouble() * 20 + Math.Cos(i * 0.4) * 5;
            var quality = 90 + random.NextDouble() * 8;
            var oee = availability * performance * quality / 10_000;

            points.Add(new OeeTrendPoint
            {
                Timestamp = timestamp,
                Oee = Math.Round(oee, 1),
                Availability = Math.Round(availability, 1),
                Performance = Math.Round(performance, 1),
                Quality = Math.Round(quality, 1)
            });

            timestamp += step;
        }

        return Task.FromResult<IReadOnlyList<OeeTrendPoint>>(points);
    }

    public Task<IReadOnlyList<DowntimeReason>> GetDowntimeReasonsAsync(
        string lineId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default)
    {
        var reasons = lineId switch
        {
            "A" => new[]
            {
                ("BREAKDOWN", "설비 고장", 85, 4),
                ("MATERIAL", "자재 부족", 62, 6),
                ("CHANGEOVER", "금형 교체", 48, 2),
                ("OPERATOR", "작업자 대기", 35, 5),
                ("QUALITY", "품질 확인", 22, 3)
            },
            "B" => new[]
            {
                ("BREAKDOWN", "설비 고장", 72, 3),
                ("CLEANING", "도장부스 세척", 55, 4),
                ("MATERIAL", "도료 부족", 40, 2),
                ("CHANGEOVER", "색상 변경", 38, 3),
                ("OPERATOR", "작업자 대기", 18, 2)
            },
            _ => new[]
            {
                ("BREAKDOWN", "설비 고장", 45, 2),
                ("CALIBRATION", "검사 교정", 38, 3),
                ("QUALITY", "품질 확인", 30, 4),
                ("MATERIAL", "자재 부족", 25, 2),
                ("OPERATOR", "작업자 대기", 15, 2)
            }
        };

        var list = reasons
            .Select(r => new DowntimeReason
            {
                ReasonCode = r.Item1,
                ReasonName = r.Item2,
                Minutes = r.Item3,
                EventCount = r.Item4
            })
            .OrderByDescending(r => r.Minutes)
            .ToList();

        return Task.FromResult<IReadOnlyList<DowntimeReason>>(list);
    }

    public Task<IReadOnlyList<AlarmEvent>> GetActiveAlarmsAsync(
        string lineId,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.Now;
        var alarms = new List<AlarmEvent>
        {
            new()
            {
                Id = $"{lineId}-1",
                OccurredAt = now.AddMinutes(-12),
                EquipmentName = lineId == "A" ? "조립로봇 #2" : lineId == "B" ? "도장부스 #1" : "비전검사 #1",
                Message = "비상 정지 — 안전 센서 감지",
                Severity = AlarmSeverity.Critical,
                IsAcknowledged = false
            },
            new()
            {
                Id = $"{lineId}-2",
                OccurredAt = now.AddMinutes(-35),
                EquipmentName = lineId == "A" ? "체결기" : lineId == "B" ? "건조로" : "분류기",
                Message = "사이클 타임 목표 초과 (+18%)",
                Severity = AlarmSeverity.Warning,
                IsAcknowledged = false
            },
            new()
            {
                Id = $"{lineId}-3",
                OccurredAt = now.AddMinutes(-58),
                EquipmentName = "컨베이어",
                Message = "정기 점검 예정 (30분 후)",
                Severity = AlarmSeverity.Info,
                IsAcknowledged = true
            }
        };

        return Task.FromResult<IReadOnlyList<AlarmEvent>>(alarms);
    }
}
