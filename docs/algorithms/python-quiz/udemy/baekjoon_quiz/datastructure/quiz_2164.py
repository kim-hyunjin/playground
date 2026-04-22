from collections import deque

def solution(N):
    cards = makeCards(N)

    while len(cards) > 1:
        cards.popleft()
        cards.append(cards.popleft())

    return cards[0]

def makeCards(N):
    return deque([i+1 for i in range(N)])


def main():
    print(solution(int(input())))
if __name__ == "__main__":
    main()