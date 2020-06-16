import { forEach } from "lodash";
import {
  RESET,
  BEGIN_GAME,
  FINISH_GAME,
  UPDATE_BOARD,
  ResetAction,
  BeginGameAction,
  MinesweeperAction,
  FinishGameAction,
  UpdateBoardAction,
  INITIALIZE_BOARD,
  InitializeBoardAction
} from "./types";
import { AppThunkAction } from "../../../../../src/store";
import { Cell, CellStatus } from "../helpers/cellHelper";
import { modifyBoard, getCellsToReveal, getCellsAround } from "../helpers/boardHelper";
import { getBoard, getDiscovered, getFinishTime } from "./selectors";

export const cellClick = (row: number, column: number): AppThunkAction<MinesweeperAction> => (
  dispatch,
  getState
) => {
  const state = getState();
  const board = getBoard(state);

  const cell = board[row][column];

  if (cell.IsMine) {
    dispatch(clickOnMine(board, cell));
  } else {
    const cellsAlreadyDiscovered = getDiscovered(state);
    dispatch(clickOnNoMineSpace(board, cell, cellsAlreadyDiscovered));
  }
};

const clickOnMine = (board: Cell[][], cell: Cell) => {
  const { pendingMines, badMarked } = getPendingMinesAndBadMarked(board, cell);

  const cellsToUpdate = [
    ...pendingMines.map(it => ({ ...it, Status: CellStatus.Mine })),
    ...badMarked.map(it => ({ ...it, Status: CellStatus.MarkedAsMineButEmpty })),
    { ...cell, Status: CellStatus.ExploitedMine }
  ];

  const newBoard = modifyBoard(board, cellsToUpdate);

  return finishAction(newBoard);
};

const clickOnNoMineSpace = (board: Cell[][], cell: Cell, cellsAlreadyDiscovered: number) => {
  const cellsToReveal = getCellsToReveal(board, cell.Row, cell.Column).map(it => ({
    ...it,
    Status: it.MinesAround > 0 ? CellStatus.DiscoveredAndNumber : CellStatus.DiscoveredAndEmpty
  }));
  const newBoard = modifyBoard(board, cellsToReveal);
  return updateBoardAction(newBoard, cellsAlreadyDiscovered + cellsToReveal.length);
};

const getPendingMinesAndBadMarked = (board: Cell[][], cell: Cell) => {
  const boardLength = board.length;
  if (boardLength === 0) return { pendingMines: [], badMarked: [] };
  const boardColumnsLength = board[0].length;

  const pendingMines = [];
  const badMarked = [];
  for (let rowIndex = 0; rowIndex < boardLength; rowIndex++) {
    const row = board[rowIndex];

    for (let columIndex = 0; columIndex < boardColumnsLength; columIndex++) {
      const currentCell = row[columIndex];

      if (currentCell.Key === cell.Key) continue;

      if (currentCell.IsMine && currentCell.Status === CellStatus.UnDiscovered) {
        pendingMines.push(currentCell);
        continue;
      }

      if (!currentCell.IsMine && currentCell.Status === CellStatus.MarkedAsMine)
        badMarked.push(currentCell);
    }
  }

  return { pendingMines, badMarked };
};

export const revealSurroundingNoMarkedMines = (
  row: number,
  column: number
): AppThunkAction<AppThunkAction<MinesweeperAction>> => async (dispatch, getState) => {
  const state = getState();
  const board = getBoard(state);
  const surroundingCells = getCellsAround(board, row, column);
  const currentCell = board[row][column];

  if (currentCell.Status !== CellStatus.DiscoveredAndNumber) return;

  const surroundingMarkedMines = surroundingCells.filter(
    cell => cell.Status === CellStatus.MarkedAsMine
  );

  if (currentCell.MinesAround !== surroundingMarkedMines.length) return;

  const cellsToReveal = surroundingCells.filter(cell => cell.Status === CellStatus.UnDiscovered);
  forEach(cellsToReveal, cell => {
    const newState = getState();
    const isGameOver = Boolean(getFinishTime(newState));

    if (isGameOver) return false;

    dispatch(cellClick(cell.Row, cell.Column));
  });
};

export const switchMarkAsMine = (
  row: number,
  column: number
): AppThunkAction<MinesweeperAction> => async (dispatch, getState) => {
  const state = getState();
  const board = getBoard(state);
  const discovered = getDiscovered(state);

  const cell = board[row][column];

  if (cell.Status !== CellStatus.MarkedAsMine && cell.Status !== CellStatus.UnDiscovered) return;

  const newStatus =
    cell.Status === CellStatus.MarkedAsMine ? CellStatus.UnDiscovered : CellStatus.MarkedAsMine;

  const newBoard = modifyBoard(board, [ { ...cell, Status: newStatus } ]);
  dispatch(updateBoardAction(newBoard, discovered));
};

export const initializeBoardAction = (
  board: Cell[][],
  rows: number,
  columns: number
): InitializeBoardAction => ({
  type: INITIALIZE_BOARD,
  board,
  rows,
  columns
});

export const beginAction = (
  board: Cell[][],
  rows: number,
  columns: number,
  mines: number
): BeginGameAction => ({
  type: BEGIN_GAME,
  board,
  rows,
  columns,
  mines
});

export const finishAction = (board: Cell[][]): FinishGameAction => ({
  type: FINISH_GAME,
  board
});

export const updateBoardAction = (board: Cell[][], discoveredCells: number): UpdateBoardAction => ({
  type: UPDATE_BOARD,
  board,
  discoveredCells
});

export const resetAction = (): ResetAction => ({ type: RESET });
