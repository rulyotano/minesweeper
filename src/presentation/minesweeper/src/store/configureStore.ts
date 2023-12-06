import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { ApplicationState, reducers } from "./";

export default function customConfigureStore(initialState?: ApplicationState) {
  const rootReducer = combineReducers({
    ...reducers
  });

  return configureStore(
    {
      reducer: rootReducer,
      preloadedState: initialState
    }
  );
}
