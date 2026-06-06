# 집합, Set 은 중복을 허용하지 않는다.

set = set()
set.add(123)
set.add(123)
set.add(234)
set.add(234)
set.add(345)
set.add(456)
set.add(567)
set.add(999)

print("size:", len(set))
print(set)

set.pop() # 랜던한 값을 뺀다.
print(set)

set.clear()
print(set)