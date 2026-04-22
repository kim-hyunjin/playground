"""
Flask 웹 애플리케이션 서버 파일

이 파일은 ice-breaker 애플리케이션의 웹 인터페이스를 제공합니다.
사용자가 이름을 입력하면 해당 인물에 대한 정보를 검색하고 요약하여 표시합니다.
"""

from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
from ice_breaker import ice_break_with

# 환경 변수 로드 (.env 파일에서 API 키 등을 가져옴)
load_dotenv()

# Flask 애플리케이션 초기화
app = Flask(__name__)


@app.route("/")
def index():
    """
    루트 경로 핸들러 - 메인 페이지 렌더링
    
    Returns:
        HTML: index.html 템플릿을 렌더링하여 반환
    """
    return render_template("index.html")


@app.route("/process", methods=["POST"])
def process():
    """
    POST 요청 처리 핸들러 - 사용자가 입력한 이름으로 정보 검색
    
    Returns:
        JSON: 검색된 인물에 대한 요약 정보와 프로필 사진 URL을 JSON 형식으로 반환
    """
    # 폼에서 이름 가져오기
    name = request.form["name"]
    # ice_break_with 함수를 호출하여 이름으로 정보 검색
    summary, profile_pic_url = ice_break_with(name=name)
    # 결과를 JSON으로 반환
    return jsonify(
        {"summary_and_facts": summary.to_dict(), "picture_url": profile_pic_url}
    )


if __name__ == "__main__":
    # 개발 서버 실행 (디버그 모드 활성화)
    app.run(host="0.0.0.0", port=5001, debug=True)
