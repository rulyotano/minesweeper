import { Action, Reducer } from "redux";
import {
  RESET,
  BEGIN_GAME,
  MinesweeperAction,
  BeginGameAction,
  FINISH_GAME,
  FinishGameAction,
  UPDATE_BOARD,
  UpdateBoardAction,
  INITIALIZE_BOARD,
  InitializeBoardAction
} from "./types";
import { Cell } from "../helpers/cellHelper";

export interface ReducerState {
  rows: number;
  columns: number;
  gameIsStarted: boolean;
  gameStartTime: Date | null;
  gameFinishTime: Date | null;
  mines: number;
  discoveredCells: number;
  board: Cell[][];
}

export const initialState: ReducerState = {
  rows: 0,
  columns: 0,
  gameIsStarted: false,
  gameStartTime: null,
  gameFinishTime: null,
  mines: 0,
  discoveredCells: 0,
  board: []
};

const reducer: Reducer<ReducerState> = (
  state: ReducerState | undefined = initialState,
  action: MinesweeperAction
) => {
  switch (action.type) {
    case BEGIN_GAME: {
      const customAction = action as BeginGameAction;
      return {
        ...state,
        rows: customAction.rows,
        columns: customAction.columns,
        board: customAction.board,
        mines: action.mines,
        discoveredCells: 0,
        gameFinishTime: null,
        gameIsStarted: true,
        gameStartTime: new Date()
      };
    }
    case FINISH_GAME: {
      const customAction = action as FinishGameAction;
      return {
        ...state,
        board: customAction.board,
        gameFinishTime: new Date(),
        gameIsStarted: false
      };
    }

    case UPDATE_BOARD: {
      const customAction = action as UpdateBoardAction;
      return {
        ...state,
        board: customAction.board,
        discoveredCells: customAction.discoveredCells
      };
    }
    case INITIALIZE_BOARD: {
      const customAction = action as InitializeBoardAction;
      return {
        ...initialState,
        board: customAction.board,
        rows: customAction.rows,
        columns: customAction.columns
      };
    }
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
