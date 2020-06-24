import { Selector } from "redux-testkit";
import moment from "moment";
import { ApplicationState } from "../../../../../store";
import {
  getBoard,
  getRows,
  getColumns,
  getIsGameStarted,
  getStartTime,
  getFinishTime,
  getMines,
  getDiscovered,
  getElapsedTime,
  getIsFinished
} from "../selectors";
import { ReducerState } from "../reducer";
import { buildBoard } from "../../helpers/boardHelper";

describe("components > app > minesweeper > selectors", () => {
  const FAKE_BOARD = buildBoard(3, 3, 0, 0, 3);

  const fakeState: ReducerState = {
    board: FAKE_BOARD,
    columns: 10,
    rows: 11,
    discoveredCells: 9,
    gameFinishTime: new Date(),
    gameIsStarted: true,
    gameStartTime: new Date(),
    mines: 2
  };

  const getStateWith = (stateData: ReducerState): ApplicationState => ({
    minesweeper: {
      ...stateData
    }
  });

  test("getBoard() should return 'board' in state", () => {
    Selector(getBoard)
      .expect(
        getStateWith({
          ...fakeState
        })
      )
      .toReturn(FAKE_BOARD);
  });

  test("getRows() should return 'rows' in state", () => {
    Selector(getRows)
      .expect(
        getStateWith({
          ...fakeState
        })
      )
      .toReturn(fakeState.rows);
  });

  test("getColumns() should return 'columns' in state", () => {
    Selector(getColumns)
      .expect(
        getStateWith({
          ...fakeState
        })
      )
      .toReturn(fakeState.columns);
  });

  test("getIsGameStarted() should return 'gameIsStarted' in state", () => {
    Selector(getIsGameStarted)
      .expect(
        getStateWith({
          ...fakeState
        })
      )
      .toReturn(fakeState.gameIsStarted);
  });

  test("getStartTime() should return 'gameStartTime' in state", () => {
    Selector(getStartTime)
      .expect(
        getStateWith({
          ...fakeState
        })
      )
      .toReturn(fakeState.gameStartTime);
  });

  test("getFinishTime() should return 'gameFinishTime' in state", () => {
    Selector(getFinishTime)
      .expect(
        getStateWith({
          ...fakeState
        })
      )
      .toReturn(fakeState.gameFinishTime);
  });

  test("getMines() should return 'mines' in state", () => {
    Selector(getMines)
      .expect(
        getStateWith({
          ...fakeState
        })
      )
      .toReturn(fakeState.mines);
  });

  test("getDiscovered() should return 'discoveredCells' in state", () => {
    Selector(getDiscovered)
      .expect(
        getStateWith({
          ...fakeState
        })
      )
      .toReturn(fakeState.discoveredCells);
  });

  test("getIsFinished() should return 'true' when finish have finish time, 'false' otherwise", () => {
    Selector(getIsFinished)
      .expect(
        getStateWith({
          ...fakeState,
          gameFinishTime: new Date()
        })
      )
      .toReturn(true);

    Selector(getIsFinished)
      .expect(
        getStateWith({
          ...fakeState,
          gameFinishTime: null
        })
      )
      .toReturn(false);
  });
});
