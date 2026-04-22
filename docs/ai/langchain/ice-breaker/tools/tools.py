"""
LinkedIn 프로필 URL 검색 도구 모듈

이 파일은 Tavily 검색 API를 사용하여 LinkedIn 프로필 URL을 검색하는 도구를 제공합니다.
현재는 실제 API 호출 대신 간단한 URL 생성 함수로 구현되어 있습니다.
"""

from langchain_community.tools.tavily_search import TavilySearchResults


def get_profile_url_tavily(name: str):
    """
    주어진 이름으로 LinkedIn 프로필 페이지를 검색하는 함수
    
    Args:
        name (str): 검색할 사람의 이름
        
    Returns:
        str: 찾은 LinkedIn 프로필 URL
    """
    # https://tavily.com/ 에서 만든 툴을 사용하면 구글에서 크롤링해 원하는 url을 찾을 수 있음.
    # TAVILY_API_KEY 필요
    # 아래는 Tavily API를 사용하는 실제 구현 (현재는 주석 처리됨)
    # search = TavilySearchResults()
    # res = search.run(f"{name}")
    # return res[0]["url"]
    
    # 간단한 테스트를 위해 이름을 기반으로 LinkedIn URL 생성
    return f"https://www.linkedin.com/in/{name}/"
