# What is Redux

```
A state management system for cross-component or app-wide state
```

## Cross-Component / App-Wide state

- Local State
  : State that belongs to a single component
  : e.g. listening to user input in a input field
- Cross-Component State
  : State that affects multiple components
  : e.g. open/closed state of a modal overlay
- App-Wide State
  : State that affects the entire app (most/ all components)
  : e.g. user authentication status

## Redux vs React Context

React Context - potential disadvantages

- complex setup / management

```javascript
// context hell

return (
  <>
    <ReduxProvider value={store}>
      <ThemeProvider value={theme}>
        <OtherProvider value={otherValue}>
          <OtherOtherProvider value={otherOtherValue}>
            {/** ... other providers*/}
            <HellProvider value={hell}>
              <HelloWorld />
            </HellProvider>
            {/** ... other providers*/}
          </OtherOtherProvider>
        </OtherProvider>
      </ThemeProvider>
    </ReduxProvider>
  </>
);
```

- performance
  - not optimized for high frequency state changes

## Core Redux Concepts

```
Central Data Store
  -- subscription -=>
Components
  -- Dispatch -->
Action
  -->
Reducer Function
  -- mutate store data -->
Central Data Store
```

### Reducer Function

Should be a pure function - same input, same output

```
Inputs: Old State + Dispatched Action
==>
Output: New State Object
```

### exam

```javascript
const redux = require('redux');

const counterReducer = (state = { counter: 0 }, action) => {
  if (action.type === 'increment') {
    return {
      counter: state.counter + 1,
    };
  }

  if (action.type === 'decrement') {
    return {
      counter: state.counter - 1,
    };
  }

  return state;
};

const store = redux.createStore(counterReducer);

const counterSubscriber = () => {
  const latestState = store.getState();
  console.log(latestState);
};

store.subscribe(counterSubscriber);

store.dispatch({ type: 'increment' });
store.dispatch({ type: 'decrement' });
```

## Side Effects, Async Tasks & Redux

Reducers must be pure, side-effect free, synchronous functions

### Where should side-effects and async tasks be executed?

- Inside the components(e.g. useEffect())
- Inside the action creators
