import { RESET, ResetAction, MinesweeperAction } from "./types";
import { AppThunkAction, ApplicationState } from "../../../../../src/store";

export const sampleThunk = (): AppThunkAction<MinesweeperAction> => (dispatch, getState) => {
  dispatch({ type: RESET });
};

export const sampleAction = (value: any): ResetAction => ({ type: RESET });
