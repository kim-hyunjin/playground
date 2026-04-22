import heapq as hq

def solution(q, M):
    pq = []
    # 환자들을 우선순위 큐에 집어 넣음
    for i in q:
        hq.heappush(pq, i)
    
    answer = 0
    i = 0
    while True:
        if pq[0] == q[i]:
            # 환자가 진료를 받았다
            answer += 1
            hq.heappop(pq)
            q[i] = 0

            # M번째 환자가 맞다면 break
            if (i == M): break 
        
        i += 1
        # 재순회하기 위해 i값 조정
        if (i == len(q)): i = i % len(q)
    
    return answer


def test():
    q = [60, 50, 70, 80, 90]
    M = 2
    expect = 3
    
    actual = solution(q, M)

    if (expect == actual): print(True)
    else: print(False)

test()