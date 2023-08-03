import { Action, Reducer } from 'redux';
import { SAMPLE_TYPE_KEY } from "./types";

export interface ReducerState {
}

export const initialState: ReducerState = {};

const reducer: Reducer<ReducerState> = (state: ReducerState | undefined = initialState, { type }: Action) => {
  switch (type) {
    case SAMPLE_TYPE_KEY:
      return { ...state };
    default:
      return state;
  }
};

export default reducer;
