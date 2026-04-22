package section24errorhandling

import (
	"fmt"
	"log"
	"os"
)

func loggingExam1() {
	defer foo()
	_, err := os.Open("no-file.txt")
	if err != nil {
		fmt.Println("err happend", err)
		log.Println("err happend", err) // with timestamp
		log.Fatalln(err) // with os.Exit(1), program shutdown
		// panic(err)
	}
}

func foo() {
	fmt.Println("when os.Exit() is called, deffered function don't run")
}

func loggingExam2() {
	f, err := os.Create("log.txt")
	if err != nil {
		fmt.Println(err)
	}
	defer f.Close()
	log.SetOutput(f)

	f2, err := os.Open("no-file.txt")
	if err != nil {
		log.Println("err happend", err)
	}
	defer f2.Close()

	fmt.Println("check the log.txt file in the directory")
}