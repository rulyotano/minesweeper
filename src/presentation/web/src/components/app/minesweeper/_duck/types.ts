import { Cell } from "../helpers/cellHelper";

export const RESET = "MINESWEEPER_RESET";
export const BEGIN_GAME = "MINESWEEPER_BEGIN_GAME";
export const FINISH_GAME = "MINESWEEPER_FINISH_GAME";
export const UPDATE_BOARD = "MINESWEEPER_UPDATE_BOARD";
export const INITIALIZE_BOARD = "MINESWEEPER_INITIALIZE";
export const SET_USERNAME = "MINESWEEPER_SET_USERNAME";
export const USERNAME_STORAGE_KEY = "username";

export interface ResetAction {
  type: "MINESWEEPER_RESET";
}

export interface InitializeStateAction {
  type: "MINESWEEPER_BEGIN_GAME";
  rows: number;
  columns: number;
  mines: number;
  board: Cell[][];
}

export interface BeginGameAction {
  type: "MINESWEEPER_BEGIN_GAME";
  rows: number;
  columns: number;
  mines: number;
  board: string[][];
  boardCells: Map<string, Cell>;
}

export interface FinishGameAction {
  type: "MINESWEEPER_FINISH_GAME";
  boardCells: Map<string, Cell>;
}

export interface UpdateBoardAction {
  type: "MINESWEEPER_UPDATE_BOARD";
  boardCells: Map<string, Cell>;
  discoveredCells: number;
}

export interface InitializeBoardAction {
  type: "MINESWEEPER_INITIALIZE";
  board: string[][];
  boardCells: Map<string, Cell>;
  rows: number;
  columns: number;
}

export interface SetUsername {
  type: "MINESWEEPER_SET_USERNAME";
  username: string | null;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type MinesweeperAction =
  | ResetAction
  | BeginGameAction
  | FinishGameAction
  | UpdateBoardAction
  | InitializeBoardAction
  | SetUsername;
