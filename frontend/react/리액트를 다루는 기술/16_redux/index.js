import {createStore} from 'redux';

const divToggle = document.querySelector('.toggle');
const counter = document.querySelector('h1');
const btnIncrease = document.querySelector('#increase');
const btnDecrease = document.querySelector('#decrease');

// 액션 타입
const TOGGLE_SWITCH = 'TOGGLE_SWITCH';
const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

// 액션 생성 함수
const toggleSwitch = () => ({type: TOGGLE_SWITCH});
const increase = difference => ({type: INCREASE, difference});
const decrease = () => ({type: DECREASE});

// 초깃값
const initialState = {
  toggle: false,
  counter: 0
};

// 리듀서 함수
function reducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SWITCH:
      return {
        ...state,
        toggle: !state.toggle
      };
    case INCREASE:
      return {
        ...state,
        counter: state.counter + action.difference
      };
    case DECREASE:
      return {
        ...state,
        counter: state.counter - 1
      };
    default:
      return state;
  }
}

// 스토어
const store = createStore(reducer);

// render 함수
const render = () => {
  const state = store.getState(); // 현재 상태를 불러온다.
  console.log(state);
  
  if(state.toggle) {
    divToggle.classList.add('active');
  } else {
    divToggle.classList.remove('active');
  }
  counter.innerText = state.counter;
}

render(); // 초기 렌더링

// 구독
store.subscribe(render);

// 디스패치
divToggle.addEventListener("click", () => {
  console.log('toggle!');
  store.dispatch(toggleSwitch());
});
btnIncrease.addEventListener("click", () => {
  console.log('increase!');
  store.dispatch(increase(1));
});
btnDecrease.addEventListener("click", () => {
  console.log('decrease!');
  store.dispatch(decrease());
});