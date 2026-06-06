package main

import "fmt"

func main() {
	m := map[string]int {
		"James": 32,
		"Miss Moneypenny": 27,
	}

	fmt.Println(m)
	fmt.Println(m["James"])
	fmt.Println(m["Barnabas"]) // 0

	v, ok := m["Barnabas"]
	fmt.Println(v) // 0
	fmt.Println(ok) // false

	if v, ok := m["Barbanas"]; ok {
		fmt.Println("THIS IS THE IF PRINT", v)
	}
	if v, ok := m["James"]; ok {
		fmt.Println("THIS IS THE IF PRINT", v)
	}

	m["todd"] = 33

	for k, v := range m {
		fmt.Println(k, v)
	}

	delete(m, "todd")
	fmt.Println(m)

	delete(m, "Ian Fleming") // no error
	fmt.Println(m)

}
