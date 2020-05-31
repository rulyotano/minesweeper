import { Thunk } from "redux-testkit";
import { SAMPLE_ACTION_TYPE } from "../types";
import { sampleAction, sampleThunk } from "../actions";
import { sampleSelector } from "../selectors";

jest.mock("../selectors");

describe("components > ... > actions", () => {
  afterEach(() => {
    sampleSelector.mockReset();
  });

  test("sampleAction() should return action with type SAMPLE_ACTION_TYPE and payload: some-value", () => {
    const fakeValue = "fake value";

    const action = sampleAction(fakeValue);

    expect(action.type).toBe(SAMPLE_ACTION_TYPE);
    expect(action.payload).toBe(fakeValue);
  });

  test("Thunk sampleThunk() should make one dispatch with action sampleAction with the some value", async () => {
    const fakeState = "fake state";
    const fakeValue = "fake value";
    sampleSelector.mockReturnValue(fakeValue);

    const dispatches = await Thunk(sampleThunk)
      .withState(fakeState)
      .execute();

    expect(sampleSelector).toBeCalledWith(fakeState);
    expect(dispatches).toHaveLength(1);
    expect(dispatches[0].getAction()).toEqual(sampleAction(fakeValue));
  });
});
