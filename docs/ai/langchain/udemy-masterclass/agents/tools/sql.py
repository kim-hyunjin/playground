"""
LangChain 에이전트를 위한 SQL 도구

이 모듈은 LangChain 에이전트를 통해 SQLite 데이터베이스와 상호작용하기 위한 도구를 제공합니다.
테이블 목록 조회, SQL 쿼리 실행, 테이블 스키마 설명 기능을 포함합니다.
이러한 도구들은 에이전트가 자연어 요청을 기반으로 데이터베이스와 상호작용하는 데 사용됩니다.
"""

import sqlite3  # SQLite 데이터베이스 상호작용을 위한 라이브러리
from langchain.tools import Tool  # LangChain 도구 생성을 위한 클래스
from pydantic.v1 import BaseModel  # 인수 스키마 정의를 위한 클래스
from typing import List  # 타입 힌트를 위한 라이브러리

# SQLite 데이터베이스에 연결
conn = sqlite3.connect("db.sqlite")


def list_tables():
    """
    SQLite 데이터베이스의 모든 테이블을 나열합니다.
    
    Returns:
        str: 줄바꿈으로 구분된 테이블 이름 문자열
    """
    c = conn.cursor()
    # sqlite_master 테이블을 쿼리하여 모든 테이블 이름 가져오기
    c.execute("SELECT name FROM sqlite_master WHERE type='table';")
    rows = c.fetchall()
    # 테이블 이름을 줄바꿈으로 연결하고 None 값 필터링
    return "\n".join(row[0] for row in rows if row[0] is not None)


def run_sqlite_query(query):
    """
    SQLite 쿼리를 실행하고 결과를 반환합니다.
    
    Args:
        query (str): 실행할 SQL 쿼리
        
    Returns:
        list or str: 튜플 리스트 형태의 쿼리 결과 또는 쿼리 실패 시 오류 메시지
    """
    c = conn.cursor()
    try:
        # 쿼리 실행
        c.execute(query)
        # 결과 반환
        return c.fetchall()
    except sqlite3.OperationalError as err:
        # 쿼리 실패 시 오류 메시지 반환
        return f"The following error occured: {str(err)}"


# run_sqlite_query 함수 인수를 위한 Pydantic 스키마 정의
class RunQueryArgsSchema(BaseModel):
    """run_sqlite_query 함수 인수를 위한 스키마."""
    query: str  # 실행할 SQL 쿼리


# run_sqlite_query 함수로부터 LangChain 도구 생성
run_query_tool = Tool.from_function(
    name="run_sqlite_query",  # 도구의 이름
    description="Run a sqlite query.",  # 도구의 설명
    func=run_sqlite_query,  # 호출할 함수
    args_schema=RunQueryArgsSchema,  # 함수 인수를 위한 스키마
)


def describe_tables(table_names):
    """
    지정된 테이블의 스키마를 가져옵니다.
    
    Args:
        table_names (List[str]): 설명할 테이블 이름 목록
        
    Returns:
        str: 줄바꿈으로 구분된 테이블 스키마 문자열
    """
    c = conn.cursor()
    # SQL 쿼리를 위한 테이블 이름 형식 지정
    tables = ", ".join("'" + table + "'" for table in table_names)
    # sqlite_master 테이블을 쿼리하여 테이블을 생성한 SQL 문 가져오기
    rows = c.execute(
        f"SELECT sql FROM sqlite_master WHERE type='table' and name IN ({tables})"
    )
    # SQL 문을 줄바꿈으로 연결하고 None 값 필터링
    return "\n".join(row[0] for row in rows if row[0] is not None)


# describe_tables 함수 인수를 위한 Pydantic 스키마 정의
class DescribeTabesArgsSchema(BaseModel):
    """describe_tables 함수 인수를 위한 스키마."""
    table_names: List[str]  # 설명할 테이블 이름 목록


# describe_tables 함수로부터 LangChain 도구 생성
describe_tables_tools = Tool.from_function(
    name="describe_tables",  # 도구의 이름
    description="Given a list of table names, returns schema of those tables",  # 도구의 설명
    func=describe_tables,  # 호출할 함수
    args_schema=DescribeTabesArgsSchema,  # 함수 인수를 위한 스키마
)
