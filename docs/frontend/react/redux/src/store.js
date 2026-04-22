import {createStore} from 'redux';

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

export const actionCreators = {
  addToDo,
  deleteToDo
}

export default store;