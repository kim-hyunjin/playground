# 밑바닥부터 시작하는 딥러닝: 딥러닝의 근본 원리 이해

본 프로젝트는 외부 라이브러리(PyTorch, TensorFlow 등)를 사용하지 않고, **Python과 NumPy**만을 활용하여 딥러닝의 핵심 알고리즘을 직접 구현하며 신경망의 원리를 탐구하는 공간입니다.

---

## 🧠 1. 퍼셉트론 (Perceptron)

퍼셉트론은 신경망의 기원이 되는 알고리즘으로, 다수의 신호를 입력받아 하나의 신호를 출력합니다.

### 논리 회로 구현
단순한 가중치(Weight)와 편향(Bias)의 조절을 통해 AND, NAND, OR 게이트를 구현할 수 있습니다.

```python
# ai/deeplearning-from-scratch/2.perceptron/logic_gate.py
import numpy as np

def AND(x1, x2):
    x = np.array([x1, x2])
    w = np.array([0.5, 0.5]) # 가중치: 신호의 중요도 조절
    b = -0.7                 # 편향: 뉴런 활성화의 용이성 조절
    tmp = np.sum(w*x) + b
    return 1 if tmp > 0 else 0
```

### 퍼셉트론의 한계와 다층 퍼셉트론 (MLP)
단층 퍼셉트론은 직선 하나로 영역을 나누는 **선형 영역**만 표현할 수 있어 XOR 문제를 해결할 수 없습니다. 하지만 층을 쌓아 **다층 퍼셉트론**을 만들면 비선형 영역을 표현할 수 있게 됩니다.

```python
# 다층 퍼셉트론으로 구현한 XOR 게이트
def XOR(x1, x2):
    s1 = NAND(x1, x2)
    s2 = OR(x1, x2)
    return AND(s1, s2)
```

---

## 🕸️ 2. 신경망 (Neural Network)

퍼셉트론이 신경망으로 진화하기 위해 가장 중요한 개념은 **활성화 함수 (Activation Function)**입니다.

### 활성화 함수의 역할
- **Step Function:** 0 또는 1만 출력 (초기 퍼셉트론)
- **Sigmoid Function:** 출력을 0과 1 사이의 연속적인 값으로 변환 (전통적인 신경망)
- **ReLU (Rectified Linear Unit):** 0 이하는 0, 0 이상은 그대로 출력 (현대 딥러닝의 주류)

```python
# ai/deeplearning-from-scratch/3.neural_network/activation_function.py
def relu(x):
    return np.maximum(0, x)
```

---

## 📊 3. 행렬 연산을 통한 효율적인 구현
신경망 내 수많은 뉴런의 연산을 개별적으로 처리하지 않고, **NumPy의 행렬 곱(Dot Product)**을 통해 한꺼번에 처리함으로써 연산 효율을 극대화합니다.

```python
# 3층 신경망 예시
X = np.array([1.0, 0.5])
W1 = np.array([[0.1, 0.3, 0.5], [0.2, 0.4, 0.6]])
B1 = np.array([0.1, 0.2, 0.3])

A1 = np.dot(X, W1) + B1 # 행렬 곱 연산
Z1 = sigmoid(A1)        # 활성화 함수 적용
```

---

## 📈 학습 포인트
- **가중치(Weight)와 편향(Bias):** 학습을 통해 최적의 값을 찾아가는 대상.
- **오차역전파 (Backpropagation):** 출력층에서 발생한 오차를 입력층 방향으로 전달하며 가중치를 업데이트하는 핵심 알고리즘.
- **수치 미분 (Numerical Differentiation):** 기울기(Gradient)를 구하여 손실 함수를 최소화하는 방향을 설정.

---
*본 프로젝트는 딥러닝이라는 거대한 기술의 "엔진"이 어떻게 돌아가는지 바닥부터 파헤치는 여정입니다.*
