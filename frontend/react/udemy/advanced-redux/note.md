# Pat component vs Pat Reducers vs Pat Actions

Where should our logic go?

- Synchronous, side-effect free code
  - Prefer Reducers
  - Avoid Action Creators or Components
- Async code or code with side-effect
  - Prefer Action Creators or Components
  - Never use Reducers

# What is a "Thunk"?

A function that delays an action until later  
An action creator function that does NOT return the action itself but another function which eventually returns the action
