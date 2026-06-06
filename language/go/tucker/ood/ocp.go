package main

type SendSomething struct {
}

type Something struct {
}

// ocp 위반
func (r *SendSomething) Send(s *Something, method int) {
	switch method {
	case 1:
		//
	case 2:
		//
	case 3:
		//
	case 4:
		//
	}
}

// 인터페이스를 사용해 확장에 열려있도록 만듦
type SomethingSender interface {
	SendSomething(*Something)
}

type QuickSender struct {
}

func (f *QuickSender) SendSomething(*Something) {
	// send something quickly
}

type RocketSender struct {
}

func (r *RocketSender) SendSomething(*Something) {
	// send something with rocket
}
