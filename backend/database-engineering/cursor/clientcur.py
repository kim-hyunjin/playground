import psycopg2
import time as t

con = psycopg2.connect(host="hyunjin",
                        database="test",
                        user="postgres",
                        password="postgres")
#client side cursor
#장점: 쿼리 실행 시 모든 데이터를 클라이언트로 가져오므로 이후 페칭 속도가 매우 빠름. 데이터베이스 서버의 오버헤드 최소화.
#단점: 데이터 양이 많을 경우 클라이언트 메모리 부하 및 초기 쿼리 실행 시간(네트워크 전송) 증가

s = t.time()
cur = con.cursor()
e = (t.time() - s)*1000 
print(f"Cursor established in {e}ms")

s = t.time()
cur.execute("select * from employees")
e = (t.time() - s)*1000 
print(f"execute query {e}ms") # 여기서 시간 소요

s = t.time()
rows = cur.fetchmany(50)
e = (t.time() - s)*1000 
print(f"fetching first 50 rows {e}ms") # 여기서는 매우 빠름

cur.close()
con.close()



