# part1-chapter 
음악 플레이어 구현 

# 개요

- 백그라운드에서 기능 실행
- 음원 재생
- 디바이스 이벤트 캐치 (네트워크 상태 변경, 전원 연결, 배터리 사용량 체크 등)

# 학습목표

- 백그라운드에서 앱의 기능을 사용하고, 디바이스 이벤트를 캐치할 수 있다.
    - MediaPlayer 를 이용해 음원 재생
    - Service 를 이용해 음원 재생
    - Notificaion 에 음원 컨트롤러 제공
    - BroadcastReceiver 를 이용해 LOW_BATTERY 이벤트 캐치
    
- Android
    - [MediaPlayer](https://developer.android.com/guide/topics/media/mediaplayer?hl=ko)
    - [Service](https://developer.android.com/guide/components/services?hl=ko)
    - [Notification](https://developer.android.com/guide/topics/ui/notifiers/notifications?hl=ko)
        - PendingIntent
        - Intent flag
    - [BroadcastReceiver](https://developer.android.com/guide/components/broadcasts)

# 한 걸음 더

- 안드로이드의 4대 컴포넌트에 대해 복습해보세요.
