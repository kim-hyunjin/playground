import heapq
import sys

class AbsoluteHeap:
    def __init__(self):
        self.heap = []

    def push(self, value):
        heapq.heappush(self.heap, (abs(value), value))

    def pop(self):
        if (len(self.heap) == 0):
            return 0

        return heapq.heappop(self.heap)[1]

def main():
    n = int(input())
    hq = AbsoluteHeap()
    for _ in range(n):
        x = int(sys.stdin.readline())
        if (x == 0):
            print(hq.pop())
        else:
            hq.push(x)
        

if __name__ == '__main__':
    main()