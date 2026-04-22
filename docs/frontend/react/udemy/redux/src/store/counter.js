import { createSlice } from '@reduxjs/toolkit';

const initialState = { counter: 0, showCounter: true };

/*
const counterReducer = (state = initialState, action) => {
  if (action.type === 'increment') {
    // NEVER MUTATE EXISTING STATE, OVERRIDE IT!! - it can have unwanted and unexpected side effects, hard to debug
    // state.counter++
    // return state
    return {
      counter: state.counter + 1,
      showCounter: state.showCounter,
    };
  }

  if (action.type === 'decrement') {
    return {
      counter: state.counter - 1,
      showCounter: state.showCounter,
    };
  }

  if (action.type === 'increase') {
    return {
      counter: state.counter + action.amount,
      showCounter: state.showCounter,
    };
  }

  if (action.type === 'toggle') {
    return {
      counter: state.counter,
      showCounter: !state.showCounter,
    };
  }

  return state;
};

const store = createStore(counterReducer);
*/

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      // redux toolkit internally use immer, automatically clone existing state, so below code will be immutable
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
    increase(state, action) {
      state.counter = state.counter + action.payload;
    },
    toggle(state) {
      state.showCounter = !state.showCounter;
    },
  },
});
export const counterActions = counterSlice.actions;

export default counterSlice.reducer;
