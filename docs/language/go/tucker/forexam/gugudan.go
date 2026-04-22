package forexam

import "fmt"

func Guguan() {
	for dan := 1; dan <= 9; dan++ {
		fmt.Printf("%d단\n", dan)
		for j := 2; j <= 9; j++ {
			fmt.Printf("%d * %d = %dn", dan, j, dan*j)
		}
	}
	fmt.Println()
}

func WeirdGugudan() {
	/*
		2    4   6   3   6   9
		8	  10  12  12  15  18
		14  16  18  21  24  27
		...
	*/
	for dan := 2; dan <= 9; dan += 2 {
		printDan(dan)
	}

}

func printDan(dan int) {
	times1 := 1
	times2 := 1
	for i := 0; i < 3; i++ {

		for j := 0; j < 3; j++ {
			fmt.Printf("%10d  ", dan*times1)
			times1++
		}
		for j := 0; j < 3; j++ {
			fmt.Printf("%10d  ", (dan+1)*times2)
			times2++
		}
		fmt.Println()
	}
}
