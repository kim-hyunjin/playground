import { Dispatch, ReactNode, createContext, useReducer } from 'react';

import { CoffeeStore } from '@/types/coffee-store';

import { Coordinates } from '../types';

/**
 * state
 */
interface StoreContextState {
  location: Coordinates;
  coffeeStores: CoffeeStore[];
}

const initialState: StoreContextState = {
  location: { lat: 0, lng: 0 },
  coffeeStores: [],
};

/**
 * reducer
 */
export enum ACTION_TYPES {
  SET_LOCATION = 'SET_LOCATION',
  SET_COFFEE_STORES = 'SET_COFFEE_STORES',
}

const storeReducer = (
  state: StoreContextState,
  action: { type: ACTION_TYPES; payload: any },
): StoreContextState => {
  switch (action.type) {
    case 'SET_LOCATION': {
      return { ...state, location: action.payload };
    }
    case 'SET_COFFEE_STORES': {
      return { ...state, coffeeStores: action.payload };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

/**
 * context
 */
export const StoreContext = createContext<{
  state: StoreContextState;
  dispatch: Dispatch<{
    type: ACTION_TYPES;
    payload: any;
  }>;
}>({
  state: initialState,
  dispatch: undefined,
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
