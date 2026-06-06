const toDoForm = document.querySelector(".js-toDoForm");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.querySelector(".js-toDoList");

const TODOS_LS = "toDos";

let toDos = [];

function deleteToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  toDoList.removeChild(li);
  toDos = toDos.filter((todo) => todo.id !== li.id);
  saveToDos();
}

function createDelBtn() {
  const delBtn = document.createElement("div");
  delBtn.className = "delBtn";
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteToDo);
  return delBtn;
}

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.id = todo.id;

  const span = document.createElement("span");
  span.innerText = todo.text;

  li.appendChild(span);
  li.appendChild(createDelBtn());

  return li;
}

function createTodo(todoText) {
  const todo = {
    text: todoText,
    id: toDos.length + 1,
  };

  toDos.push(todo);
  return createTodoElement(todo);
}

function saveToDosLocalStoage() {
  localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}

function paintToDo(todo) {
  toDoList.appendChild(createTodo(todo));
  saveToDosLocalStoage();
}

function handleSubmit(event) {
  event.preventDefault();
  if (toDos.length < 7) {
    paintToDo(toDoInput.value);
  } else {
    alert("list maximum : 7");
  }
  toDoInput.value = "";
}

function loadToDos() {
  const loadedToDos = localStorage.getItem(TODOS_LS);
  if (loadedToDos) {
    const parsedToDos = JSON.parse(loadedToDos);
    parsedToDos.forEach((todo) => paintToDo(todo.text));
  }
}

function init() {
  loadToDos();
  toDoForm.addEventListener("submit", handleSubmit);
}

init();
