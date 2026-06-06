import sys

# 내 풀이
def solution(books):
    dic = {}
    for book in books:
        if book in dic:
            dic[book] += 1
        else:
            dic[book] = 1

    sorted_dic = sorted(dic.items(), key=lambda item: item[1], reverse=True)
    mostSelled = []
    max = 0
    for book in sorted_dic:
        if book[1] >= max:
            max = book[1]
            mostSelled.append(book[0])
    
    mostSelled.sort()
    return mostSelled[0]

# 강좌 풀이
def solution2(books):
    d = dict()
    for book in books:
        if book in d:
            d[book] += 1
        else:
            d[book] = 1

    # 이렇게 하면 쉽게 dictionary의 max value값을 구할 수 있음
    mostSelledCnt = max(d.values())
    candidate = []
    for k, v in d.items(): # dictionary를 [(key, value)] 로 바꿈
        if v == mostSelledCnt:
            candidate.append(k)

    return sorted(candidate)[0] # sorted()는 정렬된 새 배열을 만든다

def main():
    N = int(input())
    books = []
    for _ in range(N):
        books.append(sys.stdin.readline())
    
    print(solution(books))

if __name__ == "__main__":
    main()