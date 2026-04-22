package restful

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

var userMap map[int]*User
var lastID int

// User struct
type User struct {
	ID int `json:"id"`
	FirstName string `json:"first_name"`
	LastName string `json:"last_name"`
	Email string `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}


func indexHandler(rw http.ResponseWriter, r *http.Request) {
	fmt.Fprint(rw, "hello, world")
}

func usersHandler(rw http.ResponseWriter, r *http.Request) {
	if len(userMap) == 0 {
		rw.WriteHeader(http.StatusOK)
		fmt.Fprint(rw, "No Users")
		return
	}
	users := []*User{}
	for _, u := range userMap {
		users = append(users, u)
	}
	data, _ := json.Marshal(users)
	rw.Header().Add("content-type", "application/json")
	rw.WriteHeader(http.StatusOK)
	fmt.Fprint(rw, string(data))
}

func getUserInfoHandler(rw http.ResponseWriter, r *http.Request) {
	user := new(User)
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		rw.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(rw, err)
		return
	}
	user, ok := userMap[id]
	if !ok {
		rw.WriteHeader(http.StatusOK)
		fmt.Fprint(rw, "No User With ID:", id)
		return
	}

	rw.Header().Add("content-type", "application/json")
	rw.WriteHeader(http.StatusOK)
	data, _ := json.Marshal(user)
	fmt.Fprint(rw, string(data))
}

func createUserHandler(rw http.ResponseWriter, r *http.Request) {
	user := new(User)
	err := json.NewDecoder(r.Body).Decode(user)
	if err != nil {
		rw.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(rw, err)
		return
	}

	// Created User
	lastID++
	user.ID = lastID
	user.CreatedAt = time.Now()
	userMap[user.ID] = user

	rw.Header().Add("content-type", "application/json")
	rw.WriteHeader(http.StatusCreated)
	data, _ := json.Marshal(user)
	fmt.Fprint(rw, string(data))
}

func deleteUserHandler(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		rw.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(rw, err)
		return
	}

	_, ok := userMap[id]
	if !ok {
		rw.WriteHeader(http.StatusOK)
		fmt.Fprint(rw, "No User ID With: ", id)
		return
	}

	delete(userMap, id)
	rw.WriteHeader(http.StatusOK)
	fmt.Fprint(rw, "User ID With: ", id, " Deleted!")
}

func updateUserHandler(rw http.ResponseWriter, r *http.Request) {
	updateUser := new(User)
	err := json.NewDecoder(r.Body).Decode(updateUser)
	if err != nil {
		rw.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(rw, err)
		return
	}
	user, ok := userMap[updateUser.ID]
	if !ok {
		rw.WriteHeader(http.StatusOK)
		fmt.Fprint(rw, "No User With ID: ", updateUser.ID)
		return
	}

	if updateUser.FirstName != "" {
		user.FirstName = updateUser.FirstName
	}
	if updateUser.LastName != "" {
		user.LastName = updateUser.LastName
	}
	if updateUser.Email != "" {
		user.Email = updateUser.Email
	}

	data, _ := json.Marshal(userMap[user.ID])
	rw.Header().Add("content-type", "application/json")
	rw.WriteHeader(http.StatusOK)
	fmt.Fprint(rw, string(data))
}

// NewHandler make a new handler
func NewHandler() http.Handler {
	userMap = make(map[int]*User)
	lastID = 0
	mux := mux.NewRouter()

	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/users", usersHandler).Methods("GET")
	mux.HandleFunc("/users", createUserHandler).Methods("POST")
	mux.HandleFunc("/users", updateUserHandler).Methods("PUT")
	mux.HandleFunc("/users/{id:[0-9]+}", getUserInfoHandler).Methods("GET")
	mux.HandleFunc("/users/{id:[0-9]+}", deleteUserHandler).Methods("DELETE")
	return mux
}