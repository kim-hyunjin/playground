# Flask: 웹 애플리케이션 프레임워크
# Response: Flask에서 HTTP 응답을 직접 제어할 수 있도록 해줌
# render_template: HTML 템플릿을 렌더링하는 데 사용
from flask import Flask, Response, render_template

# Flask 애플리케이션 인스턴스를 생성
app = Flask(__name__)


def stream_screen():
    # pyautogui: 화면 캡처와 GUI 자동화를 위한 라이브러리
    import pyautogui

    # numpy: 배열 연산 및 수학적 계산을 위한 라이브러리
    import numpy as np

    # cv2: OpenCV 라이브러리로, 이미지 및 비디오 처리
    import cv2

    # time: 시간 관련 작업을 처리하는 표준 라이브러리
    import time

    # 무한 루프를 통해 지속적으로 화면을 캡처하고 스트림을 제공
    while True:
        # 화면을 캡처
        screen = pyautogui.screenshot()
        # 화면 이미지를 NumPy 배열로 변환
        frame = np.array(screen)
        # RGB 형식에서 BGR 형식으로 변환 (OpenCV에서 사용하는 형식)
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        # 이미지를 JPEG 형식으로 인코딩
        ret, buffer = cv2.imencode(".jpg", frame)
        # 인코딩된 이미지를 바이트 형태로 변환
        frame = buffer.tobytes()
        # MIME 형식의 멀티파트 메시지로 이미지를 전송
        yield (b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")
        # 프레임 속도를 조정하기 위해 잠시 대기 (1초)
        time.sleep(1)


#
# Flask 애플리케이션의 app 객체에 URL 경로 /에 대한 라우트를 정의
@app.route("/")
def index():
    # 루트 URL로 요청이 들어올 때 호출됨
    # render_template를 사용하여 'index.html' 템플릿을 렌더링
    return render_template("index.html")


#
# '/screen_feed' 경로에 대해 라우트를 정의
@app.route("/screen_feed")
def screen_feed():
    # stream_screen 함수의 생성자(generator)를 통해 화면 스트림을 제공
    return Response(
        stream_screen(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )


#
#
# 애플리케이션이 직접 실행될 때 실행
if __name__ == "__main__":
    # 애플리케이션을 0.0.0.0 주소의 포트 5000에서 디버그 모드로 실행
    app.run(host="0.0.0.0", port=5000, debug=True)
