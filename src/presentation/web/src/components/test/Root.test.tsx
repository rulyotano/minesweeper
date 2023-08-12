import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import App from "../Root";

jest.mock("../app/minesweeper", () => () => null);

it("renders without crashing", () => {
  const storeFake = (state: any) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state })
  });
  const store = storeFake({ board: {} }) as any;

  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>,
    document.createElement("div")
  );
});

it("test", () => {
  expect("5").toEqual("5"); //test change 9
});
