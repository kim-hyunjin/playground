# 파이썬에서는 dictionary가 있다.

map = {}
map["Kim"] = 40
map["Lee"] = 100
map["Jung"] = 50

print("size:", len(map))

for key in map: # 맵에 들어있는 key 순회
    print(key, map[key])

# C++에서는 맵이 레드블랙 트리로 되어 있다.
# 파이썬에서는 hash 테이블을 사용한다.