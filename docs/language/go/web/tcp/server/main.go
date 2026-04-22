package main

import (
	"bufio"
	"fmt"
	"log"
	"net"
	"strings"
	"time"
)

func main() {
	li, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Panic(err)
	}
	defer li.Close()

	for {
		conn, err := li.Accept()
		if err != nil {
			log.Panic(err)
		}

		go handle(conn)
		// io.WriteString(conn, "\nHello from TCP server\n")
		// fmt.Fprintln(conn, "How is your day?")
		// fmt.Fprintf(conn, "%v", "Well, I hope!")

		// conn.Close()
	}
}

func handle(conn net.Conn) {
	err := conn.SetDeadline(time.Now().Add(10 * time.Second))
	if err != nil {
		log.Println("CONN TIMEOUT")
	}

	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		ln := strings.ToLower(scanner.Text())
		fmt.Println(ln)
		fmt.Fprintf(conn, "I heard you say %s\n", ln)

		bs := []byte(ln)
		r := rot13(bs)
		fmt.Fprintf(conn, "%s - %s\n\n", ln, r)
	}
	defer conn.Close()

}

func rot13(bs []byte) []byte {
	var r13 = make([]byte, len(bs))
	for i, v := range bs {
		if v <= 109 {
			r13[i] = v + 13
		} else {
			r13[i] = v - 13
		}
	}
	return r13
}
