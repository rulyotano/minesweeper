import { Reducer } from "redux-testkit";
import reducer, { initialState } from "../reducer";
import {
  RESET,
  BEGIN_GAME,
  BeginGameAction,
  FinishGameAction,
  FINISH_GAME,
  UPDATE_BOARD,
  UpdateBoardAction
} from "../types";
import { buildBoard } from "../../helpers/boardHelper";

describe("components > app > minesweeper > reducer", () => {
  const emptyAction = { type: "" };
  const _Date = Date;
  const FAKE_NOW_DATE = new Date();

  beforeAll(() => {
    // Lock Time
    global.Date = jest.fn(() => FAKE_NOW_DATE);
    global.Date.UTC = _Date.UTC;
    global.Date.parse = _Date.parse;
  });

  afterAll(() => {
    // Unlock Time
    global.Date.now = _Date.now;
  });

  test("when no matching, initial event, should return INITIAL state", () => {
    Reducer(reducer).expect(emptyAction).toReturnState(initialState);
  });

  test("when no matching, should return PREVIOUS state", () => {
    const previousState = { anyStateField: true };
    Reducer(reducer).withState(previousState).expect(emptyAction).toReturnState(previousState);
  });

  test("when RESET should return initial state", () => {
    const previousState = { anyStateField: true };
    Reducer(reducer).withState(previousState).expect({ type: RESET }).toReturnState(initialState);
  });

  test("when BEGIN_GAME should: change board, set gameIsStarted = true, set gameStartTime, set rows, set columns, set mines, set discovered mines to 0, gameFinishTime to undefined", () => {
    const previousState = {
      board: [],
      rows: 1,
      columns: 2,
      gameIsStarted: false,
      gameStartTime: undefined,
      mines: 3,
      discovered: 4,
      gameFinishTime: new Date(FAKE_NOW_DATE)
    };

    const ROWS = 14;
    const COLS = 15;
    const CLICKED_R = 3;
    const CLICKED_C = 4;
    const MINES = 20;

    const action: BeginGameAction = {
      board: buildBoard(ROWS, COLS, CLICKED_R, CLICKED_C, MINES),
      columns: COLS,
      mines: MINES,
      rows: ROWS,
      type: BEGIN_GAME
    };
    Reducer(reducer).withState(previousState).expect(action).toChangeInState({
      rows: ROWS,
      columns: COLS,
      gameIsStarted: true,
      gameFinishTime: null,
      mines: MINES,
      discoveredCells: 0,
      board: action.board,
      gameStartTime: new Date(FAKE_NOW_DATE)
    });
  });

  test("when FINISH_GAME should: change board, set gameIsStarted = false, gameFinishTime to now", () => {
    const previousState = {
      board: [],
      gameIsStarted: true,
      gameFinishTime: null
    };

    const ROWS = 14;
    const COLS = 15;
    const CLICKED_R = 3;
    const CLICKED_C = 4;
    const MINES = 20;

    const action: FinishGameAction = {
      board: buildBoard(ROWS, COLS, CLICKED_R, CLICKED_C, MINES),
      type: FINISH_GAME
    };
    Reducer(reducer).withState(previousState).expect(action).toChangeInState({
      gameIsStarted: false,
      gameFinishTime: FAKE_NOW_DATE,
      board: action.board
    });
  });

  test("when UPDATE_BOARD should: change board and set discoveredCells", () => {
    const previousState = {
      board: [],
      discoveredCells: 9
    };

    const ROWS = 14;
    const COLS = 15;
    const CLICKED_R = 3;
    const CLICKED_C = 4;
    const MINES = 20;

    const action: UpdateBoardAction = {
      board: buildBoard(ROWS, COLS, CLICKED_R, CLICKED_C, MINES),
      undiscoveredCells: 10,
      type: UPDATE_BOARD
    };
    Reducer(reducer).withState(previousState).expect(action).toChangeInState({
      discoveredCells: action.undiscoveredCells,
      board: action.board
    });
  });
});
