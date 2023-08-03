import { Selector } from "redux-testkit";
import { ApplicationState } from "../../src/store";
import { sampleSelector } from "../selectors";

describe("components > ... > selectors", () => {
  const getStateWith = (stateData): ApplicationState => ({
    minesweeper: {
      ...stateData
    }
  });

  test("sampleSelector() should return 'samplePropInState' in state", () => {
    Selector(sampleSelector)
      .expect(
        getStateWith({
          samplePropInState: true
        })
      )
      .toReturn(true);
  });
});
