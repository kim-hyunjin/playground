package main

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/pat"
	"github.com/unrolled/render"
	"github.com/urfave/negroni"
)

var rd *render.Render

type User struct {
	Name string `json:"name"`
	Email string `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

func getUserInfoHandler(w http.ResponseWriter, r *http.Request) {
	user := User{Name:"hyunjin", Email:"hyunjin1612@gmail.com"}

	rd.JSON(w, http.StatusOK, user)
	// w.Header().Add("Content-type", "application/json")
	// w.WriteHeader(http.StatusOK)
	// data, _ := json.Marshal(user)
	// fmt.Fprint(w, string(data))
}

func addUserHandler(w http.ResponseWriter, r *http.Request) {
	user := new(User)
	err := json.NewDecoder(r.Body).Decode(user)
	if err != nil {
		rd.Text(w, http.StatusBadRequest, err.Error())
		// w.WriteHeader(http.StatusBadRequest)
		// fmt.Fprint(w, err)
		return
	}
	user.CreatedAt = time.Now()

	rd.JSON(w, http.StatusOK, user)
	// w.Header().Add("Content-type", "application/json")
	// w.WriteHeader(http.StatusOK)
	// data, _ := json.Marshal(user)
	// fmt.Fprint(w, string(data))
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	// tmpl, err := template.New("Hello").ParseFiles("hello.tmpl")
	// if err != nil {
	// 	rd.Text(w, http.StatusInternalServerError, err.Error())
	// 	// w.WriteHeader(http.StatusInternalServerError)
	// 	// fmt.Fprint(w, err)
	// 	return
	// }
	user := User{Name:"hyunjin", Email:"hyunjin1612@gmail.com"}
	rd.HTML(w, http.StatusOK, "body", user) // templates/*.tmpl 로 폴더명과 파일명이 고정되어있다.
	// tmpl.ExecuteTemplate(w, "hello.tmpl", "HyunJin")
}

func main() {
	rd = render.New(render.Options{
		Directory: "template",
		Extensions: []string{".html", ".tmpl"},
		Layout: "hello",
	}) // 옵션을 통해 폴더명과 파일 확장자를 지정할 수 있다.
	mux := pat.New()

	mux.Get("/users", getUserInfoHandler)
	mux.Post("/users", addUserHandler)
	mux.Get("/hello", helloHandler)

	n := negroni.Classic()
	n.UseHandler(mux)
	// negroni가 기본적으로 파일서버 제공
	// mux.Handle("/", http.FileServer(http.Dir("public")))

	http.ListenAndServe(":3000", n)
}