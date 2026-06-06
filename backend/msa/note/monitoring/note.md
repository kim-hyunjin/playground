# Prometheus

https://prometheus.io/

- Metrics 수집, 모니터링 및 알람에 사용되는 오픈소스 애플리케이션
- CNCF에서 관리되는 2번째 공식 프로젝트 (1번째는 쿠버네티스)
- Pull 방식의 구조와 다양한 Metric Exporter 제공
- 시계열 DB에 Metrics 저장 -> 조회 가능 (Query)

## 설치

```
$ docker run -d \
    -p 9090:9090 \
    -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
    prom/prometheus
```

## 실행

- http://localhost:9000

# Grafana

https://grafana.com/grafana/

- 데이터 시각화, 모니터링 및 분석을 위한 오픈소스 애플리케이션
- 시계열 데이터를 시각화하기 위한 대시보드 제공

## 설치

```
(Alpine base image)
$ docker run -d --name=grafana -p 3000:3000 grafana/grafana-enterprise

(Ubuntu base image)
docker run -d --name=grafana -p 3000:3000 grafana/grafana-enterprise:8.3.2-ubuntu
```

## 실행

- http://localhost:3000
- ID: admin, PW: admin

### 대시보드 설정

https://grafana.com/grafana/dashboards/
