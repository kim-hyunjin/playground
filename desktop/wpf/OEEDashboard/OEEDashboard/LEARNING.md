# OEE Dashboard — WPF + REST API 학습 가이드

제조 현장에서 쓰는 **OEE(종합설비효율) 모니터링 대시보드**입니다.  
TodoApp에서 익힌 MVVM 패턴에 **REST API 연동**, **차트**, **자동 갱신**을 추가했습니다.

## 실행 방법

1. Visual Studio에서 `OEEDashboard.slnx` 열기
2. **F5** 실행

기본값은 **Mock API**입니다. 별도 백엔드 없이 바로 실행됩니다.

## 프로젝트 구조

```
OEEDashboard/
├── appsettings.json         ← API 설정 (BaseUrl, Mock/Real 전환)
├── MainWindow.xaml          ← 대시보드 레이아웃
├── Models/                  ← API 응답 DTO
├── Services/
│   ├── IOeeApiService.cs    ← REST 계약 (인터페이스)
│   ├── OeeApiService.cs     ← HttpClient 구현
│   └── MockOeeApiService.cs ← 개발용 Mock
├── ViewModels/              ← UI 상태·차트 데이터
├── Views/KpiCardView.xaml   ← KPI 카드 UserControl
└── Converters/
```

## REST API 계약

실제 백엔드를 붙일 때 아래 엔드포인트를 맞추면 됩니다.

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/lines` | 생산 라인 목록 |
| GET | `/api/oee/summary?lineId=&from=&to=` | KPI 요약 |
| GET | `/api/oee/equipment?lineId=&from=&to=` | 설비별 OEE |
| GET | `/api/oee/trend?lineId=&from=&to=` | OEE 추이 |
| GET | `/api/downtime/reasons?lineId=&from=&to=` | 다운타임 원인 |
| GET | `/api/alarms/active?lineId=` | 활성 알람 |

## Mock → Real API 전환

`appsettings.json`:

```json
{
  "Api": {
    "BaseUrl": "http://localhost:5080",
    "UseMockData": false,
    "RefreshIntervalSeconds": 30
  }
}
```

`UseMockData`를 `false`로 바꾸면 `OeeApiService`(HttpClient)가 사용됩니다.

## TodoApp과의 차이

| TodoApp | OEE Dashboard |
|---------|---------------|
| 로컬 데이터 | REST API (Mock/HttpClient) |
| 리스트 CRUD | 집계·통계 API |
| UserControl 카드 | KPI 카드 + LiveCharts2 |
| 수동 갱신 | 30초 자동 갱신 + 수동 새로고침 |

## 다음 확장 아이디어

- ASP.NET Core Minimal API 백엔드 추가
- JWT 로그인
- SignalR 실시간 알람
- 설비 상세 드릴다운 화면
