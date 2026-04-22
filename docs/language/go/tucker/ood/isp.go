package main

// isp 위반
type Actor interface {
	Move()
	Attack()
	Talk()
}

type User struct {
}

func (u *User) Move() {

}

func (u *User) Attack() {

}

func (u *User) Talk() {

}

func MoveTo1(a Actor) { // 움직임을 관장하는 메소드
	a.Attack() // 그 안에서 공격 메소드를 호출할 수 있다. ==> isp와 srp 모두 위반
}

// 인터페이스를 잘게 쪼개기
type Talkable interface {
	Talk()
}

type Attackable interface {
	Attack()
}

type Movable interface {
	Move()
}

func MoveTo2(a Movable) {
	a.Move() // Move만 호출 가능
}
