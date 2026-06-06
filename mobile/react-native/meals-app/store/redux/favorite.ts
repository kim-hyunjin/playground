import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FavoriteState {
  ids: string[];
}

const initialState: FavoriteState = {
  ids: [],
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.ids.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.ids.splice(state.ids.indexOf(action.payload), 1);
    },
  },
});

export const { addFavorite, removeFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;

export const isFavorite = (state: FavoriteState, id: string) => {
  return state.ids.includes(id);
};
