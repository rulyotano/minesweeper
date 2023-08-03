import { SAMPLE_TYPE_KEY, SampleAction1, KnownAction } from "./types";
import { AppThunkAction, ApplicationState } from "../../src/store";

export const sampleThunk = (): AppThunkAction<KnownAction> => (dispatch, getState) => {
  dispatch({ type: SAMPLE_TYPE_KEY });
};

export const sampleAction = (value): SampleAction1 => ({ type: SAMPLE_TYPE_KEY });