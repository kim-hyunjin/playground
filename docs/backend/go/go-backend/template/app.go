package main

import (
	"html/template"
	"os"
)


type User struct {
	Name  string
	Email string
	Age   int
}

func (u User) IsOld() bool {
	return u.Age >= 40
}

func main() {
	user := User{Name:"hyunjin", Email:"hyunjin1612@gmail.com", Age:29}
	user2 := User{Name: "aaa", Email:"aaa@gmail.com", Age:40}
	users := []User{user, user2}
	tmpl, err := template.New("Tmpl").Parse("Name: {{.Name}}\nEmail: {{.Email}}\nAge: {{.Age}}")
	tmpl2, _ := template.ParseFiles("template1.tmpl", "template2.tmpl")
	if err != nil {
		panic(err)
	}
	
	tmpl.Execute(os.Stdout, user)

	tmpl2.ExecuteTemplate(os.Stdout, "template1.tmpl", user)
	tmpl2.ExecuteTemplate(os.Stdout, "template1.tmpl", user2)

	tmpl2.ExecuteTemplate(os.Stdout, "template2.tmpl", users)
}