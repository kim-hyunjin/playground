import psycopg2
import time as t

con = psycopg2.connect(host="hyunjin",
                        database="test",
                        user="postgres",
                        password="postgres")
#server side cursor
#장점: 클라이언트 메모리 사용량이 적고, 초기 쿼리 실행 시 데이터를 모두 가져오지 않으므로 응답 시작이 빠름. 대용량 데이터 처리에 적합.
#단점: 데이터를 가져올 때마다 서버와 통신해야 하므로 페칭 속도가 상대적으로 느리고, 서버 리소스를 계속 점유함.

s = t.time()
cur = con.cursor("hyunjin") # 커서 이름 지정 - 서버 사이드 커서
e = (t.time() - s)*1000 
print(f"Cursor established in {e}ms")

s = t.time()
cur.execute("select * from employees")
e = (t.time() - s)*1000 
print(f"execute query {e}ms")

s = t.time()
rows = cur.fetchmany(50)
e = (t.time() - s)*1000 
print(f"fetching first 50 rows {e}ms") # 클라이언트 사이드 커서보다 느림

cur.close()
con.close()


