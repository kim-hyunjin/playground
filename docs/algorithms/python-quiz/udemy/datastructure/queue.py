from collections import deque

# queue 모듈의 Queue가 있지만 이 클래스는 thread-safe 를 위한 로직이 들어있어 무겁다.
# 코딩테스트에서는 따라서 collections 모듈의 deque를 사용할 것

dq = deque()
dq.append(123)
dq.append(456)
dq.append(789)

print(dq.pop()) # 뒤에서 뺀다
print(dq.popleft()) # 앞에서 뺀다