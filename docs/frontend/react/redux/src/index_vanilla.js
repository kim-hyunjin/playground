import {createStore} from 'redux';
// target html
const form = document.querySelector("form");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

// type
const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";

// action
const addToDo = text => {
  return {
    type: ADD_TODO,
    text
  }
}
const deleteToDo = id => {
  return {
    type:DELETE_TODO,
    id
  }
}

// reducer
const reducer = (state = [], action) => {
  console.log(state, action)
  switch (action.type) {
    case ADD_TODO:
      return [...state, {text: action.text, id: Date.now()}];
    case DELETE_TODO:
      return state.filter(e => e.id !== action.id);
    default:
      return state;
  }
};
const store = createStore(reducer);

// dispatch
const dispatchAddToDo = text => {
  store.dispatch(addToDo(text));
}
const dispatchDeleteToDo = e => {
  const id = parseInt(e.target.parentNode.id);
  store.dispatch(deleteToDo(id))
}

// 이벤트 리스너 등록
const paintToDos = () => {
  const toDos = store.getState();
  ul.innerHTML = "";
  toDos.forEach(toDo => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerText = "DELETE";
    btn.addEventListener("click", dispatchDeleteToDo);
    li.id = toDo.id;
    li.innerText = toDo.text;
    li.appendChild(btn);
    ul.appendChild(li);
  })
}
store.subscribe(paintToDos);
store.subscribe(() => {
  console.log(store.getState())
})

// dom event
const onSubmit = e => {
  e.preventDefault();
  const toDo = input.value;
  input.value = "";
  dispatchAddToDo(toDo)
};
form.addEventListener("submit", onSubmit);
