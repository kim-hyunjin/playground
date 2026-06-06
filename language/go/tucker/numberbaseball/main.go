package main

import (
	"fmt"
	"math/rand"
	"time"
)

type Result struct {
	strikes int
	balls   int
}

func main() {
	rand.Seed(time.Now().UnixNano()) // Seed 값을 항상 변하는 값으로 설정해야 한다. 대표적으로 시간을 많이 사용.
	// 무작위 숫자 3개를 만든다.
	numbers := MakeNumbers()

	cnt := 0
	for {
		cnt++
		// 사용자의 입력을 받는다.
		inputNumbers := InputNumbers()

		// 숫자를 비교한다.
		result := CompareNumbers(numbers, inputNumbers)

		PrintResult(result)

		// 게임 종료 여부를 체크한다.
		if IsGameEnd(result) {
			// 게임 끝
			fmt.Println("축하합니다! 승리하셨습니다.")
			break
		} else {
			fmt.Println("\n다시 맞춰보세요!\n")
		}
	}

	// 게임 통계 출력
	fmt.Printf("%d 번만에 맞췄습니다.", cnt)
}

func MakeNumbers() [3]int {
	// 0 ~ 9 사이의 겹치지 않는 무작위 숫자 3개를 반환한다.
	var rst [3]int
	for i := 0; i < 3; i++ {
		for {
			n := rand.Intn(10)
			duplicated := false
			for j := 0; j < i; j++ {
				if rst[j] == n {
					duplicated = true
					break
				}
			}
			if !duplicated {
				rst[i] = n
				break
			}
		}
	}
	// fmt.Println(rst)
	return rst
}

func InputNumbers() [3]int {
	// 키보드로부터 0 ~ 9 사이의 겹치지 않는 숫자 3개를 입력받아 반환한다.
	rst := [3]int{-1, -1, -1}
	var no int
	for {
		fmt.Println("\n겹치지 않는 0 ~ 9 사이의 숫자 3개를 연속해서 입력 후 ENTER를 치세요.")
		_, err := fmt.Scanf("%d\n", &no)
		if err != nil {
			fmt.Println("\n잘못 입력하셨습니다.")
			continue
		}

		success := true
		idx := 2
		for no > 0 {
			n := no % 10
			no = no / 10

			duplicated := false
			for j := 0; j < len(rst); j++ {
				if rst[j] == n {
					duplicated = true
					break
				}
			}
			if duplicated {
				success = false
				break
			}

			if idx < 0 {
				success = false
				break
			}

			rst[idx] = n
			idx--
		}

		if success && idx != -1 {
			success = false
		}

		if !success {
			for i := 0; i < len(rst); i++ {
				rst[i] = -1
			}
			continue
		}
		break

	}
	// fmt.Println(rst)
	return rst
}

func CompareNumbers(numbers [3]int, InputNumbers [3]int) Result {
	// 숫자 3개 묶음 2개를 받아 비교 후 결과를 반환한다.
	strikes := 0
	balls := 0
	for i := 0; i < 3; i++ {
		for j := 0; j < 3; j++ {
			if numbers[i] == InputNumbers[j] {
				if i == j {
					strikes++
				} else {
					balls++
				}
				break
			}
		}
	}
	return Result{strikes, balls}
}

func PrintResult(result Result) {
	fmt.Printf("%d 스트라이크 %d 볼\n", result.strikes, result.balls)
}

func IsGameEnd(result Result) bool {
	// 비교 결과가 스트라이크 세 개인지 확인
	return result.strikes == 3
}
