package calculator

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func Cal() {
	fmt.Println("숫자를 입력하세요.")
	reader := bufio.NewReader(os.Stdin)
	line, _ := reader.ReadString('\n') // _ : 이름없는 변수(ReadString의 결과 중 하나를 처리하지 않고 받기만하려고 선언)
	line = strings.TrimSpace(line)

	n1, _ := strconv.Atoi(line)

	line, _ = reader.ReadString('\n')
	line = strings.TrimSpace(line)

	n2, _ := strconv.Atoi(line)

	fmt.Printf("입력하신 숫자는 %d, %d 입니다.\n", n1, n2)

	fmt.Println("연산자를 입력하세요.")

	line, _ = reader.ReadString('\n')
	line = strings.TrimSpace(line)

	switch line {
	case "+":
		fmt.Printf("%d + %d = %d", n1, n2, n1+n2)
	case "-":
		fmt.Printf("%d - %d = %d", n1, n2, n1-n2)
	case "*":
		fmt.Printf("%d * %d = %d", n1, n2, n1*n2)
	case "/":
		fmt.Printf("%d / %d = %d", n1, n2, n1/n2)
	default:
		fmt.Println("잘못 입력하셨습니다.")
	}

	// if line == "+" {
	// 	fmt.Printf("%d + %d = %d", n1, n2, n1+n2)
	// } else if line == "-" {
	// 	fmt.Printf("%d - %d = %d", n1, n2, n1-n2)
	// } else if line == "*" {
	// 	fmt.Printf("%d * %d = %d", n1, n2, n1*n2)
	// } else if line == "/" {
	// 	fmt.Printf("%d / %d = %d", n1, n2, n1/n2)
	// } else {
	// 	fmt.Println("잘못 입력하셨습니다.")
	// }
}
