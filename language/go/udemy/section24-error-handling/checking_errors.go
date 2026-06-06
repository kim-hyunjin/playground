package section24errorhandling

import (
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"strings"
)

func checkingExam() {
	write()
	read()
}

func write() {
	f, err := os.Create("names.txt")
	if err != nil {
		fmt.Println(err)
	}
	defer f.Close()

	r := strings.NewReader("wassup")

	io.Copy(f, r)

}

func read() {
	f, err := os.Open("names.txt")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()

	bs, err := ioutil.ReadAll(f)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(string(bs))
}