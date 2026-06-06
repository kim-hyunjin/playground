package main

type Player struct {
}

type Monster struct {
}

type Chest struct {
}

// dip 위반
// 구체화된 클래스에 의존하고 있어서 플레이어와 몬스터가 상자를 때릴 수 있는 함수를 또 추가해야 됨.
func (p *Player) Attack(m *Monster) {

}

func (p *Player) AttackP(p2 *Player) {

}

func (m *Monster) Attack(p *Player) {

}

func (m *Monster) AttackM(m2 *Monster) {

}

// 인터페이스를 사용하도록 변경
type Attackable2 interface {
	Attack(BeAttackable)
}

type BeAttackable interface {
	BeAttacked()
}

func Attack(attacker Attackable2, defender BeAttackable) {
	attacker.Attack(defender)
}

type Player2 struct {
}

func (p *Player2) Attack(target BeAttackable) {
	target.BeAttacked()
}

type Monster2 struct {
}

func (m *Monster2) Attack(target BeAttackable) {
	target.BeAttacked()
}

type Chest2 struct {
}

func (c *Chest2) BeAttacked() {

}
