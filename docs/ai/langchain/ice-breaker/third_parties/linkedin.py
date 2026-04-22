"""
LinkedIn 프로필 스크래핑 모듈

이 파일은 LinkedIn 프로필 정보를 스크래핑하는 기능을 제공합니다.
현재는 실제 스크래핑 대신 미리 준비된 샘플 데이터를 사용하는 모의(mock) 모드만 구현되어 있습니다.
"""

import os
import requests
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()


def scrape_linkedin_profile(linkedin_profile_url: str, mock: bool = False):
    """
    LinkedIn 프로필에서 정보를 스크래핑하는 함수
    
    Args:
        linkedin_profile_url (str): 스크래핑할 LinkedIn 프로필 URL
        mock (bool, optional): 모의 모드 사용 여부. 기본값은 False
        
    Returns:
        dict: 스크래핑한 LinkedIn 프로필 데이터
        
    Raises:
        Exception: mock=False일 때 아직 구현되지 않은 기능 호출 시 발생
    """
    if mock:
        # 모의 모드: GitHub Gist에서 샘플 데이터 가져오기
        linkedin_profile_url = "https://gist.githubusercontent.com/emarco177/0d6a3f93dd06634d95e46a2782ed7490/raw/fad4d7a87e3e934ad52ba2a968bad9eb45128665/eden-marco.json"
        response = requests.get(linkedin_profile_url, timeout=10)
    else:
        # 실제 모드: 아직 구현되지 않음
        """
        TODO: use proxycurl api or scrape linkedin profile myself
        """
        raise Exception("sorry, not implemendted yet")

    # JSON 응답 파싱
    data = response.json()

    # 토큰 개수를 줄이기 위해 필요없는 데이터 없애기
    # 빈 리스트, 빈 문자열, None 값을 가진 필드와 특정 필드(people_also_viewed, certifications) 제거
    data = {
        k: v
        for k, v in data.items()
        if v not in ([], "", None) and k not in ("people_also_viewed", "certifications")
    }

    # 프로필 사진 URL 수정 (GitHub Gist의 URL이 작동하지 않아 Udemy 이미지로 대체)
    data["profile_pic_url"] = (
        "https://img-c.udemycdn.com/user/200_H/30508036_0f4a_4.jpg"
    )

    return data


if __name__ == "__main__":
    # 테스트 실행
    print(
        scrape_linkedin_profile(
            linkedin_profile_url="https://www.linkedin.com/in/eden-macro", mock=True
        )
    )
