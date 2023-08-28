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
  BoardCellsType
} from "./types";
import { AppThunkAction } from "../../../../../src/store";
import { Cell, CellStatus, getCellKey } from "../helpers/cellHelper";
import {
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
  getBoardCells
} from "./selectors";
import { IBoardConfiguration } from "../helpers/gameHelper";

export const initialize = (
  configuration: IBoardConfiguration
): AppThunkAction<MinesweeperAction> => dispatch => {
  const [ board, boarCells ] = buildEmptyBoard(configuration.rows, configuration.columns);
  dispatch(
    initializeBoardAction(
      board,
      boarCells,
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

  const [board, boarCells] = buildBoard(configuration.rows, configuration.columns, row, column, configuration.mines);
  dispatch(
    beginAction(
      board,
      boarCells,
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
  const boardCells = getBoardCells(state);

  const cellKey = board[row][column];
  const cell = boardCells[cellKey];

  if (
    cell.Status === CellStatus.MarkedAsMine ||
    cell.Status === CellStatus.DiscoveredAndEmpty ||
    cell.Status === CellStatus.DiscoveredAndNumber
  )
    return;

  if (cell.IsMine) {
    dispatch(clickOnMine(board, boardCells, cell));
  } else {
    const cellsAlreadyDiscovered = getDiscovered(state);
    dispatch(clickOnNoMineSpace(board, boardCells, cell, cellsAlreadyDiscovered));
    const newState = getState();
    const isWon = getIsGameWon(newState);
    if (isWon) {
      dispatch(finishAction(boardCells));
    }
  }
};

const clickOnMine = (board: Array<string[]>, boardCells: BoardCellsType, cell: Cell) => {
  const { pendingMines, badMarked } = getPendingMinesAndBadMarked(board, boardCells, cell);

  const cellsToUpdate: Cell[] = [
    ...pendingMines.map(it => ({ ...it, Status: CellStatus.Mine })),
    ...badMarked.map(it => ({ ...it, Status: CellStatus.MarkedAsMineButEmpty })),
    { ...cell, Status: CellStatus.ExploitedMine }
  ];

  const newBoardCells: BoardCellsType = {...boardCells };
  cellsToUpdate.forEach(cell => newBoardCells[cell.Key] = cell);

  return finishAction(newBoardCells);
};

const clickOnNoMineSpace = (board: Array<string[]>, boardCells: BoardCellsType, cell: Cell, cellsAlreadyDiscovered: number) => {
  const cellsToReveal = getCellsToReveal(board, boardCells, cell.Row, cell.Column).map(it => ({
    ...it,
    Status: it.MinesAround > 0 ? CellStatus.DiscoveredAndNumber : CellStatus.DiscoveredAndEmpty
  }));
  const newBoardCells: BoardCellsType = {...boardCells};
  cellsToReveal.forEach(cell => newBoardCells[cell.Key] = cell);
  return updateBoardAction(newBoardCells, cellsAlreadyDiscovered + cellsToReveal.length);
};

const getPendingMinesAndBadMarked = (board: Array<string[]>, boardCells: BoardCellsType, cell: Cell) => {
  const boardLength = board.length;
  if (boardLength === 0) return { pendingMines: [], badMarked: [] };
  const boardColumnsLength = board[0].length;

  const pendingMines = [];
  const badMarked = [];
  for (let rowIndex = 0; rowIndex < boardLength; rowIndex++) {
    const row = board[rowIndex];

    for (let columIndex = 0; columIndex < boardColumnsLength; columIndex++) {
      const currentCell = boardCells[row[columIndex]];

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
  const boardCells = getBoardCells(state);
  const surroundingCells = getCellsAround(board, boardCells, row, column);
  const currentCell = boardCells[board[row][column]];

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
  const boardCells = getBoardCells(state);
  const discovered = getDiscovered(state);

  const cellKey = getCellKey(row, column)
  const cell = boardCells[cellKey];

  if (cell.Status !== CellStatus.MarkedAsMine && cell.Status !== CellStatus.UnDiscovered) return;

  const newStatus =
    cell.Status === CellStatus.MarkedAsMine ? CellStatus.UnDiscovered : CellStatus.MarkedAsMine;

  const updatedBoardCells = {...boardCells, [cellKey]: {...cell, Status: newStatus}};
  dispatch(updateBoardAction(updatedBoardCells, discovered));
};

export const initializeBoardAction = (
  board: string[][],
  boardCells: BoardCellsType,
  rows: number,
  columns: number
): InitializeBoardAction => ({
  type: INITIALIZE_BOARD,
  board,
  boardCells,
  rows,
  columns
});

export const beginAction = (
  board: string[][],
  boardCells: BoardCellsType,
  rows: number,
  columns: number,
  mines: number
): BeginGameAction => ({
  type: BEGIN_GAME,
  board,
  boardCells,
  rows,
  columns,
  mines
});

export const finishAction = (boardCells: BoardCellsType): FinishGameAction => ({
  type: FINISH_GAME,
  boardCells
});

export const updateBoardAction = (boardCells: BoardCellsType, discoveredCells: number): UpdateBoardAction => ({
  type: UPDATE_BOARD,
  boardCells,
  discoveredCells
});

export const resetAction = (): ResetAction => ({ type: RESET });

export const setUsername =
  (username: string|null): SetUsername =>
  {
    if (username) localStorage.setItem(USERNAME_STORAGE_KEY, username);
    return { type: SET_USERNAME, username: username };
  }
