package main

import "fmt"

type Bread struct {
	val string
}

type StrawberryJam struct {
	opened bool
}

type SpoonOfStrawBerry struct {
}

type SpoonOfOrange struct {
}

type Sandwitch struct {
	val string
}

type OrangeJam struct {
	opened bool
}

func GetBreads(num int) []*Bread {
	breads := make([]*Bread, num)
	for i := 0; i < num; i++ {
		breads[i] = &Bread{val: "bread"}
	}
	return breads
}

func OpenStrawberryJam(jam *StrawberryJam) {
	jam.opened = true
}

func OpenOrangeJam(jam *OrangeJam) {
	jam.opened = true
}

func GetOneSpoon(jam *StrawberryJam) *SpoonOfStrawBerry {
	return &SpoonOfStrawBerry{}
}

func GetOneSpoonOrangeJam(jam *OrangeJam) *SpoonOfOrange {
	return &SpoonOfOrange{}
}

func PutJamOnBread(bread *Bread, jam *SpoonOfStrawBerry) {
	bread.val += " + Strawberry Jam"
}

func PutOrangeJamOnBread(bread *Bread, jam *SpoonOfOrange) {
	bread.val += " + Orange Jam"
}

func CoverSandwitch(breads []*Bread) *Sandwitch {
	sandwitch := &Sandwitch{}
	for i := 0; i < len(breads); i++ {
		sandwitch.val += breads[i].val + " + "
	}
	return sandwitch
}

/*
	절차적 프로그래밍의 문제
	상태와 상태를 바꾸는 기능이 따로 떨어져 있다.
  딸기짐을 오렌지잼으로 바꾸는데 많은 수정이 필요하다.
*/
func MakeSandwitch() {
	// 1. 빵 두개를 꺼낸다
	breads := GetBreads(2)

	// 2. 딸기잼 뚜껑을 연다. ==> 오린제잼 뚜껑을 연다.
	// jam := &StrawberryJam{}
	jam := &OrangeJam{}
	// OpenStrawberryJam(jam)
	OpenOrangeJam(jam)

	// 3. 딸기잼을 한스푼 뜬다. ==> 오렌지잼을 한스푼 뜬다.
	// spoon := GetOneSpoon(jam)
	spoon := GetOneSpoonOrangeJam(jam)

	// 4. 딸기잼을 빵에 바른다. ==> 오렌지잼을 빵에 바른다.
	// PutJamOnBread(breads[0], spoon)
	PutOrangeJamOnBread(breads[0], spoon)

	// 5. 빵을 덮는다.
	sandwitch := CoverSandwitch(breads)

	// 6. 완성
	fmt.Println(sandwitch)
}
