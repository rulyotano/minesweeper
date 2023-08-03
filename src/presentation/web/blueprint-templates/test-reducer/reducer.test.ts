import { Reducer } from "redux-testkit";
import reducer, { initialState } from "../reducer";

describe("components > ... > reducer", () => {
  const emptyAction = { type: "" };

  test("when no matching, initial event, should return INITIAL state", () => {
    Reducer(reducer)
      .expect(emptyAction)
      .toReturnState(initialState);
  });

  test("when no matching, should return PREVIOUS state", () => {
    const previousState = { anyStateField: true };
    Reducer(reducer)
      .withState(previousState)
      .expect(emptyAction)
      .toReturnState(previousState);
  });
});
