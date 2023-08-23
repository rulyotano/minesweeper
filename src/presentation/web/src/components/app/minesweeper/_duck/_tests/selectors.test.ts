import { Selector } from "redux-testkit";
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
  getIsFinished,
  getIsGameInitialized,
  getIsGameWon,
  getIsGameLost,
  getGameLevel,
  getUsername
} from "../selectors";
import { ReducerState } from "../reducer";
import { buildBoard } from "../../helpers/boardHelper";
import { gameConfigurations } from "../../helpers/gameHelper";

describe("components > app > minesweeper > selectors", () => {
  const FAKE_BOARD = buildBoard(3, 3, 0, 0, 3);

  const fakeState: ReducerState = {
    board: FAKE_BOARD,
    columns: 10,
    rows: 11,
    discoveredCells: 9,
    gameFinishTime: new Date(),
    gameStartTime: new Date(),
    mines: 2,
    username: "user-name"
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

  describe("getIsGameStarted()", () => {
    test("when start time AND NO finish time should return true", () => {
      const state = { ...fakeState, gameFinishTime: null };
      Selector(getIsGameStarted).expect(getStateWith(state)).toReturn(true);
    });

    test("when NO start time should return false", () => {
      const state = { ...fakeState, gameStartTime: null };
      Selector(getIsGameStarted).expect(getStateWith(state)).toReturn(false);
    });

    test("when HAVE finish time should return false", () => {
      const state = { ...fakeState };
      Selector(getIsGameStarted).expect(getStateWith(state)).toReturn(false);
    });
  });

  describe("getIsGameWon()", () => {
    test("when mines = total cells - discovered cells should return true", () => {
      const totalCells = 12;
      const rows = 4;
      const cols = totalCells / rows;
      const mines = 3;
      const discovered = totalCells - mines;

      const state = { ...fakeState, rows, columns: cols, discoveredCells: discovered, mines };

      Selector(getIsGameWon).expect(getStateWith(state)).toReturn(true);
    });

    test("when mines < total cells - discovered cells should return false", () => {
      const totalCells = 12;
      const rows = 4;
      const cols = totalCells / rows;
      const mines = 3;
      const discovered = 1;

      const state = { ...fakeState, rows, columns: cols, discoveredCells: discovered, mines };

      Selector(getIsGameWon).expect(getStateWith(state)).toReturn(false);
    });
  });

  describe("getIsGameLost()", () => {
    test("when game finished AND mines < total cells - discovered cells should return true", () => {
      const totalCells = 12;
      const rows = 4;
      const cols = totalCells / rows;
      const mines = 3;
      const discovered = 1;

      const state = { ...fakeState, rows, columns: cols, discoveredCells: discovered, mines };

      Selector(getIsGameLost).expect(getStateWith(state)).toReturn(true);
    });

    test("when game finished AND mines = total cells - discovered cells should return false", () => {
      const totalCells = 12;
      const rows = 4;
      const cols = totalCells / rows;
      const mines = 3;
      const discovered = totalCells - mines;

      const state = { ...fakeState, rows, columns: cols, discoveredCells: discovered, mines };

      Selector(getIsGameLost).expect(getStateWith(state)).toReturn(false);
    });

    test("when game NOT finished return false", () => {
      const state = { ...fakeState, gameFinishTime: null };

      Selector(getIsGameLost).expect(getStateWith(state)).toReturn(false);
    });
  });

  describe("getIsGameInitialized()", () => {
    test("when NO start time AND NO finish time should return true", () => {
      const state = { ...fakeState, gameStartTime: null, gameFinishTime: null };
      Selector(getIsGameInitialized).expect(getStateWith(state)).toReturn(true);
    });

    test("when HAVE start time should return false", () => {
      const state = { ...fakeState, gameFinishTime: null };
      Selector(getIsGameInitialized).expect(getStateWith(state)).toReturn(false);
    });

    test("when HAVE finish time should return false", () => {
      const state = { ...fakeState, gameStartTime: null };
      Selector(getIsGameInitialized).expect(getStateWith(state)).toReturn(false);
    });
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

  describe("getGameLevel()", () => { 
    test("when no matching rows & columns should return beginner", () => { 
      Selector(getGameLevel)
        .expect(getStateWith({
          ...fakeState
        }))
        .toReturn(gameConfigurations.beginner)
    });

    test("when rows match beginner should return it", () => { 
      Selector(getGameLevel)
        .expect(getStateWith({
          ...fakeState,
          rows: gameConfigurations.beginner.rows,
          columns: gameConfigurations.beginner.columns,
        }))
        .toReturn(gameConfigurations.beginner)
    });

    test("when rows match intermediate should return it", () => { 
      Selector(getGameLevel)
        .expect(getStateWith({
          ...fakeState,
          rows: gameConfigurations.intermediate.rows,
          columns: gameConfigurations.intermediate.columns,
        }))
        .toReturn(gameConfigurations.intermediate)
    });

    test("when rows match expert should return it", () => { 
      Selector(getGameLevel)
        .expect(getStateWith({
          ...fakeState,
          rows: gameConfigurations.expert.rows,
          columns: gameConfigurations.expert.columns,
        }))
        .toReturn(gameConfigurations.expert)
    });
  });

  test("getUsername() should return username", () => 
  { 
    Selector(getUsername)
      .expect(getStateWith({
        ...fakeState
      }))
      .toReturn(fakeState.username);
  })
});
