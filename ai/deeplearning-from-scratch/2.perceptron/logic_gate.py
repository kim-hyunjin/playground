import numpy as np

# AND 논리 회로 구현
def AND1(x1, x2):
    w1, w2, theta = 0.5, 0.5, 0.7 # 가중치 w1, w2와 임계점 theta
    tmp = x1*w1 + x2*w2
    # 가중치를 곱한 입력의 총합이 임계값을 넘으면 1 그 외에는 0을 반환
    if tmp <= theta:
        return 0
    elif tmp > theta:
        return 1

# 가중치와 편향 도입 - 임계값 theta를 -b로 치환
def AND(x1, x2):
    x = np.array([x1, x2])
    w = np.array([0.5, 0.5]) # 가중치는 신호가 결과에 주는 영향력(중요도)을 조절하는 매개변수다.
    b = -0.7 # bias는 뉴련이 얼마나 쉽게 활성화(결과로 1을 출력)하느냐를 조정하는 매개변수다.
    tmp = np.sum(w*x) + b
    if tmp <= 0:
        return 0
    else:
        return 1

def NAND(x1, x2):
    x = np.array([x1, x2])
    w = np.array([-0.5, -0.5])
    b = 0.7
    tmp = np.sum(w*x) + b
    if tmp <= 0:
        return 0
    else:
        return 1

def OR(x1, x2):
    x = np.array([x1, x2])
    w = np.array([0.5, 0.5])
    b = -0.2
    tmp = np.sum(w*x) + b
    if tmp <= 0:
        return 0
    else:
        return 1

# 다층 퍼셉트론으로 구현
def XOR(x1, x2):
    return AND(NAND(x1, x2), OR(x1, x2))