import { Cell } from "../helpers/cellHelper";

export const RESET = "MINESWEEPER_RESET";
export const BEGIN_GAME = "MINESWEEPER_BEGIN_GAME";
export const FINISH_GAME = "MINESWEEPER_FINISH_GAME";
export const UPDATE_BOARD = "MINESWEEPER_UPDATE_BOARD";

export interface ResetAction {
  type: "MINESWEEPER_RESET";
}

export interface BeginGameAction {
  type: "MINESWEEPER_BEGIN_GAME";
  rows: number;
  columns: number;
  mines: number;
  board: Cell[][];
}

export interface FinishGameAction {
  type: "MINESWEEPER_FINISH_GAME";
  board: Cell[][];
}

export interface UpdateBoardAction {
  type: "MINESWEEPER_UPDATE_BOARD";
  board: Cell[][];
  undiscoveredCells: number;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type MinesweeperAction =
  | ResetAction
  | BeginGameAction
  | FinishGameAction
  | UpdateBoardAction;
