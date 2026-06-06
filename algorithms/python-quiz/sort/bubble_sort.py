import numpy as np


def bubble_sort(arr):
    # 큰 수가 가장 뒤로 먼저 정렬된다.
    for i in range(len(arr) - 1):
        # 먼저 정렬된 큰 수를 제외하고 크기 비교를 반복
        for j in range(len(arr) - 1 - i):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr


def test():
    length = int(input())
    arr = list(map(int, input().split()))
    bubble_sort(arr)
    for i in range(len(arr)):
        print(arr[i], end=' ')


# test()

def test2():
    arr = [13, 5, 11, 7, 23, 15]
    bubble_sort(arr)
    A = np.array(arr)
    B = np.array([5, 7, 11, 13, 15, 23])
    print(np.array_equal(A, B))


test2()
