package todoapp

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"strconv"
	"testing"

	"github.com/kim-hyunjin/go-web/todoapp/model"
	"github.com/stretchr/testify/assert"
)

func postTest(ts *httptest.Server, ass *assert.Assertions, name string) model.Todo {
	var todo model.Todo
	res, err := http.PostForm(ts.URL+"/todos", url.Values{"name":{name}})
	ass.NoError(err)
	ass.Equal(http.StatusCreated, res.StatusCode)
	err = json.NewDecoder(res.Body).Decode(&todo)
	ass.NoError(err)
	ass.Equal(todo.Name, name)
	return todo
}

func getTest(ts *httptest.Server, ass *assert.Assertions) []*model.Todo {
	todos := []*model.Todo{}

	res, err := http.Get(ts.URL+"/todos")
	ass.NoError(err)
	ass.Equal(http.StatusOK, res.StatusCode)
	err = json.NewDecoder(res.Body).Decode(&todos)
	ass.NoError(err)
	return todos
}

func deleteTest(ts *httptest.Server, ass *assert.Assertions, id int) {
	req, _ := http.NewRequest("DELETE", ts.URL+"/todos/" + strconv.Itoa(id), nil)
	res, err := http.DefaultClient.Do(req)
	ass.NoError(err)
	ass.Equal(http.StatusOK, res.StatusCode)
}

func TestTodos(t *testing.T) {
	getSessionId = func (r *http.Request) string {
		return "testSessionId"
	}

	filepath := "./test.db"
	os.Remove(filepath)
	ass := assert.New(t)
	app := MakeHandler(filepath)
	ts := httptest.NewServer(app)
	defer ts.Close()

	todo := postTest(ts, ass, "Test todo")
	id1 := todo.ID

	todo = postTest(ts, ass, "Test todo2")
	id2 := todo.ID

	todos := getTest(ts, ass)
	ass.Equal(len(todos), 2)
	for _, t := range todos {
		if t.ID == id1 {
			ass.Equal("Test todo", t.Name)
		} else if t.ID == id2 {
			ass.Equal("Test todo2", t.Name)
		} else {
			ass.Error(fmt.Errorf("testID should be id1 or id2"))
		}
	}

	res, err := http.Get(ts.URL + "/complete-todo/" + strconv.Itoa(id1) + "?complete=true")
	ass.NoError(err)
	ass.Equal(http.StatusOK, res.StatusCode)
	todos = getTest(ts, ass)
	for _, t := range todos {
		if t.ID == id1 {
			ass.True(t.Completed)
		}
	}

	deleteTest(ts, ass, id1)
	todos = getTest(ts, ass)
	ass.Equal(len(todos), 1)
}