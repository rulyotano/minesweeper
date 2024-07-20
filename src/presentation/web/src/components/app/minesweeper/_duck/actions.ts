import forEach from "lodash/forEach";
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
  InitializeBoardAction,
  SetUsername,
  SET_USERNAME,
  USERNAME_STORAGE_KEY,
  SetBoardSubmitted,
  BOARD_SUBMITTED
} from "./types";
import { AppThunkAction } from "../../../../../src/store";
import { Cell, CellStatus } from "../helpers/cellHelper";
import {
  modifyBoard,
  getCellsToReveal,
  getCellsAround,
  buildEmptyBoard,
  buildBoard
} from "../helpers/boardHelper";
import {
  getBoard,
  getDiscovered,
  getFinishTime,
  getIsGameInitialized,
  getIsGameWon,
  getIsFinished,
  getMarkedMines
} from "./selectors";
import { IBoardConfiguration } from "../helpers/gameHelper";

export const initialize = (
  configuration: IBoardConfiguration
): AppThunkAction<MinesweeperAction> => dispatch => {
  dispatch(
    initializeBoardAction(
      buildEmptyBoard(configuration.rows, configuration.columns),
      configuration.rows,
      configuration.columns
    )
  );
};

export const begin = (
  configuration: IBoardConfiguration,
  row: number,
  column: number
): AppThunkAction<MinesweeperAction | AppThunkAction<MinesweeperAction>> => (
  dispatch,
  getState
) => {
  const state = getState();

  const isInitialized = getIsGameInitialized(state);

  if (!isInitialized) return;

  dispatch(
    beginAction(
      buildBoard(configuration.rows, configuration.columns, row, column, configuration.mines),
      configuration.rows,
      configuration.columns,
      configuration.mines
    )
  );

  dispatch(cellClick(row, column));
};

export const cellClick = (row: number, column: number): AppThunkAction<MinesweeperAction> => (
  dispatch,
  getState
) => {
  const state = getState();
  const board = getBoard(state);

  const cell = board[row][column];

  if (
    cell.Status === CellStatus.MarkedAsMine ||
    cell.Status === CellStatus.DiscoveredAndEmpty ||
    cell.Status === CellStatus.DiscoveredAndNumber
  )
    return;

  if (cell.IsMine) {
    dispatch(clickOnMine(board, cell));
  } else {
    const cellsAlreadyDiscovered = getDiscovered(state);
    dispatch(clickOnNoMineSpace(board, cell, cellsAlreadyDiscovered, getMarkedMines(state)));
    const newState = getState();
    const isWon = getIsGameWon(newState);
    if (isWon) {
      dispatch(finishAction(getBoard(newState)));
    }
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

const clickOnNoMineSpace = (board: Cell[][], cell: Cell, cellsAlreadyDiscovered: number, markedMines: number) => {
  const cellsToReveal = getCellsToReveal(board, cell.Row, cell.Column).map(it => ({
    ...it,
    Status: it.MinesAround > 0 ? CellStatus.DiscoveredAndNumber : CellStatus.DiscoveredAndEmpty
  }));
  const newBoard = modifyBoard(board, cellsToReveal);
  return updateBoardAction(newBoard, cellsAlreadyDiscovered + cellsToReveal.length, markedMines);
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
  const isGameOver = getIsFinished(state);
  if (isGameOver) return;
  const board = getBoard(state);
  const discovered = getDiscovered(state);
  const previousMarkedMines = getMarkedMines(state);

  const cell = board[row][column];

  if (cell.Status !== CellStatus.MarkedAsMine && cell.Status !== CellStatus.UnDiscovered) return;

  const newStatus =
    cell.Status === CellStatus.MarkedAsMine ? CellStatus.UnDiscovered : CellStatus.MarkedAsMine;
  const newMarkedMines =
    cell.Status === CellStatus.MarkedAsMine ? previousMarkedMines - 1 : previousMarkedMines + 1;

  const newBoard = modifyBoard(board, [{ ...cell, Status: newStatus }]);
  dispatch(updateBoardAction(newBoard, discovered, newMarkedMines));
};

export const initializeBoardAction = (
  board: Cell[][],
  rows: number,
  columns: number
): InitializeBoardAction => ({
  type: INITIALIZE_BOARD,
  board,
  rows,
  columns,
  mines: 0
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

export const updateBoardAction = (board: Cell[][], discoveredCells: number, markedMines: number): UpdateBoardAction => ({
  type: UPDATE_BOARD,
  board,
  discoveredCells,
  markedMines
});

export const resetAction = (): ResetAction => ({ type: RESET });

export const setUsername =
  (username: string | null): SetUsername => {
    if (username) localStorage.setItem(USERNAME_STORAGE_KEY, username);
    return { type: SET_USERNAME, username: username };
  }

export const markBoardSubmittedAction = (): SetBoardSubmitted => ({ type: BOARD_SUBMITTED });
