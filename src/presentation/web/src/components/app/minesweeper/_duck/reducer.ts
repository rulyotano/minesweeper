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
  SetUsername,
  BOARD_SUBMITTED
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
  isBoardSubmitted: boolean,
  markedMines: number
}

export const initialState: ReducerState = {
  rows: 0,
  columns: 0,
  gameStartTime: null,
  gameFinishTime: null,
  mines: 0,
  discoveredCells: 0,
  board: [],
  username: null,
  isBoardSubmitted: false,
  markedMines: 0
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
        gameStartTime: new Date(),
        isBoardSubmitted: false
      };
    }
    case FINISH_GAME: {
      const customAction = action as FinishGameAction;
      return {
        ...state,
        board: customAction.board,
        gameFinishTime: new Date(),
        gameIsStarted: false,
        isBoardSubmitted: false
      };
    }

    case UPDATE_BOARD: {
      const customAction = action as UpdateBoardAction;
      return {
        ...state,
        board: customAction.board,
        discoveredCells: customAction.discoveredCells,
        markedMines: customAction.markedMines
      };
    }
    case INITIALIZE_BOARD: {
      const customAction = action as InitializeBoardAction;
      return {
        ...initialState,
        username: state.username,
        board: customAction.board,
        rows: customAction.rows,
        columns: customAction.columns,
        isBoardSubmitted: false
      };
    }
    case RESET:
      return {
        ...initialState,
        username: state.username
      };
    case SET_USERNAME: {
      const customAction = action as SetUsername;
      return {
        ...state,
        username: customAction.username
      }
    }
    case BOARD_SUBMITTED: {
      return {
        ...state,
        isBoardSubmitted: true
      }
    }
    default:
      return state;
  }
};

export default reducer;
