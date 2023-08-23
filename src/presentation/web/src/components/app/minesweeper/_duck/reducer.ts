import { Reducer } from "redux";
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
  InitializeBoardAction,
  SET_USERNAME,
  SetUsername
} from "./types";
import { Cell } from "../helpers/cellHelper";

export interface ReducerState {
  rows: number;
  columns: number;
  gameStartTime: Date | null;
  gameFinishTime: Date | null;
  mines: number;
  discoveredCells: number;
  board: Cell[][];
  username: string | null
}

export const initialState: ReducerState = {
  rows: 0,
  columns: 0,
  gameStartTime: null,
  gameFinishTime: null,
  mines: 0,
  discoveredCells: 0,
  board: [],
  username: null
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
    case SET_USERNAME: {
      const customAction = action as SetUsername;
      return {
        ...state,
        username: customAction.username
      }
    }
    default:
      return state;
  }
};

export default reducer;
