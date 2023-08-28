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
  BoardCellsType
} from "./types";

export interface ReducerState {
  rows: number;
  columns: number;
  gameStartTime: Date | null;
  gameFinishTime: Date | null;
  mines: number;
  discoveredCells: number;
  board: string[][];
  boardCells: BoardCellsType
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
  boardCells: {},
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
        boardCells: customAction.boardCells,
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
        boardCells: customAction.boardCells,
        gameFinishTime: new Date(),
        gameIsStarted: false
      };
    }

    case UPDATE_BOARD: {
      const customAction = action as UpdateBoardAction;
      return {
        ...state,
        boardCells: customAction.boardCells,
        discoveredCells: customAction.discoveredCells
      };
    }
    case INITIALIZE_BOARD: {
      const customAction = action as InitializeBoardAction;
      return {
        ...initialState,
        username: state.username,
        board: customAction.board,
        boardCells: customAction.boardCells,
        rows: customAction.rows,
        columns: customAction.columns
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
    default:
      return state;
  }
};

export default reducer;
