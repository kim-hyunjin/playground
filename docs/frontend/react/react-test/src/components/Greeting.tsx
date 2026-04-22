import React, { useReducer, useState } from "react";
import axios from "axios";

enum GreetingActionKind {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

interface GreetingAction {
  type: GreetingActionKind;
  payload: GreetingState;
}

interface GreetingState {
  greeting: string | null;
  error: Error | null;
}

const initialState: GreetingState = {
  error: null,
  greeting: null,
};

function greetingReducer(state: GreetingState, action: GreetingAction) {
  const { type, payload } = action;
  switch (type) {
    case GreetingActionKind.SUCCESS:
      return {
        error: null,
        greeting: payload.greeting,
      };
    case GreetingActionKind.ERROR:
      return {
        error: payload.error,
        greeting: null,
      };
    default:
      return state;
  }
}

export default function Greeting(props: { url: string }) {
  const [state, dispatch] = useReducer(greetingReducer, initialState);
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchingGreeting = async (url: string) => {
    axios
      .get(url)
      .then((res) => {
        const payload = {
          greeting: res.data.greeting,
          error: null,
        };
        dispatch({ type: GreetingActionKind.SUCCESS, payload });
        setButtonClicked(true);
      })
      .catch((err) => {
        const payload = {
          greeting: null,
          error: Error(err),
        };
        dispatch({ type: GreetingActionKind.ERROR, payload });
      });
  };

  const buttonText = buttonClicked ? "Ok" : "Load Greeting";

  return (
    <div>
      <button
        onClick={() => fetchingGreeting(props.url)}
        disabled={buttonClicked}
      >
        {buttonText}
      </button>
      {state.greeting && <h1>{state.greeting}</h1>}
      {state.error && <p role="alert">Oops, failed to fetch!</p>}
    </div>
  );
}
