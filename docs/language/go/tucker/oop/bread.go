package main

type Bread struct {
	val string
}

func (b *Bread) String() string {
	return b.val
}

func (b *Bread) PutJam(jam Jam) {
	spoon := jam.GetOneSpoon()
	b.val += spoon.String()
}
