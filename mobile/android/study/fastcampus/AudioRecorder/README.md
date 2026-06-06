# 녹음앱 (part2 - chapter2)

![캡처1](https://github.com/Fastcampus-Android-Lecture-Project-2023/part2-chapter2/blob/main/screenshot/1.jpeg)

## 이 챕터를 통해 배우는 것

1. MediaPlayer
2. MediaRecorder
3. Permission Request
4. Canvas
5. Handler

### MediaPlayer

[https://developer.android.com/guide/topics/media/mediaplayer?hl=ko](https://developer.android.com/guide/topics/media/mediaplayer?hl=ko)

### MediaRecorder

[https://developer.android.com/guide/topics/media/mediarecorder?hl=ko](https://developer.android.com/guide/topics/media/mediarecorder?hl=ko)

<aside>
💡 Android Emulator는 오디오를 녹음할 수 없습니다. 녹음할 수 있는 실제 기기에서 코드를 테스트해야 합니다.

</aside>

녹음하려면 앱에서 사용자에게 기기의 오디오 입력에 액세스할 것임을 알리는 메시지를 표시해야 합니다. 앱의 매니페스트 파일에 다음 권한 태그를 포함해야 합니다.

`<uses-permission android:name="android.permission.RECORD_AUDIO" />`

`RECORD_AUDIO`
는 사용자의 개인정보 보호에 위험을 초래할 수 있기 때문에 ['위험한' 권한](https://developer.android.com/guide/topics/permissions/overview?hl=ko#dangerous_permissions)
으로 간주됩니다. Android 6.0(API 레벨 23)부터 위험한 권한을 사용하는 앱은 런타임에 사용자에게 승인을 요청해야 합니다.

### Permission
https://developer.android.com/training/permissions/requesting?hl=ko
![https://developer.android.com/static/images/training/permissions/workflow-runtime.svg?hl=ko](https://developer.android.com/static/images/training/permissions/workflow-runtime.svg?hl=ko)
