package section14function

func returnFunc() func() int {
	f := func() int {
		return 451
	}
	return f
}