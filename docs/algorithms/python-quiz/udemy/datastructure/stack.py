# 그냥 리스트로 스택 동작 구현
stack = []
stack.append(123)
stack.append(456)
stack.append(789)
print("size:", len(stack))

while len(stack) > 0:
    print(stack[-1]) # -1 인덱스는 리스트의 맨 뒤 인덱스를 가리킨다.
    stack.pop(-1) # 이렇게 맨 뒤에서부터 빼면 스택의 삭제 구현 완료..
