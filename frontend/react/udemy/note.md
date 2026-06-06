# How React Works

- Build your own, custom HTML Elements
- React is all about "Components"
- React allows you to create re-usable and reactive components consisting of HTML and JavaScript (and CSS)
- Declarative Approach
- Define the desired target state(s) and let React figure out the actual JavaScript DOM instructions

# Why Components?

- Reusability : Don't repeat yourself
- Separation of Concerns : Don't do too many things in one and the same place (function)
- Split big chunks of code into multiple smaller functions

# React Context Limitations

- React Context is NOT optimized for high frequency changes
- React Context shouldn't be used to replace ALL component communications and props
  - Component should still be configurable via props and short "props chains" might not need any replacement

# Rules of Hooks

- Only call React Hooks in React Functions
  - React Component Functions, custom React Hooks
- Only call React Hooks at the TOP Level
  - Don't call them in nested functions, any block statements
- unofficial Rule for useEffect(): Always add everything you refer to inside of useEffect() as a dependency unless there is no good reason not do

# Behind the scene

## How Does React Work Behind The Scene?

```
React - A JavaScript library for building user interfaces
ReactDOM - Interface to the web
```

```
data(Props, State, Context) => components => Real DOM(What the user sees)
```

### how react components => real DOM

1. React determines how the component tree currently looks like and what it should look like
2. ReactDOM receives the differences and then manipulates the real DOM

```
Re-Evaluating !== Re-Rendering

react executes component function
=> Re-evaluated whenever props, state or context changes

changes to the real DOM are only made for differences between evaluations
```

### Virtual DOM diffing

실제 DOM을 조작하는 것은 비용이 비싸기 때문에, evaluation을 거쳐 차이가 있는 부분만 DOM에 적용한다.

## Understanding the Virtual DOM & DOM Updates

## Understanding State & State Updates

```
State Management <=> Components

useState hook
create state & attach to component by react
```

```
Our Code                | React
<MyProduct />             Current State : 'DVD'
setNewProduct('book')     Schedules a State Update with data 'book'
                          New State : 'book'
                          Re-evaluate Component(re-reun Component Function)
```

https://velog.io/@ckvelog/react-batch-update

# useState() vs useReducer()

| useState                                                               | useReducer                                                    |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| The main state management tool                                         | Great if you need more power                                  |
| Great for independent pieces of state/data                             | should be considered if you have related pieces of state/data |
| Greate if state updates are easy and limited to a few kinds of updates | Can be helpful if you have more complex state updates         |
