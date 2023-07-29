import random from "lodash/random";
import sumBy from "lodash/sumBy";
import groupBy from "lodash/groupBy";
import isEmpty from "lodash/isEmpty";
import keyBy from "lodash/keyBy";
import { Cell, buildCell, CellStatus } from "./cellHelper";

export const buildEmptyBoard = (rows: number, columns: number): Cell[][] => {
  var result: Cell[][] = [];

  for (let i = 0; i < rows; i++) {
    result[i] = [];

    for (let j = 0; j < columns; j++) {
      result[i][j] = buildCell(i, j);
    }
  }

  return result;
};

export const getCellsAround = (board: Cell[][], row: number, column: number): Cell[] => {
  const result: Cell[] = [];

  directions.forEach(([ vertical, horizontal ]) => {
    const verticalMove = row + vertical;
    const horizontalMove = column + horizontal;

    if (
      verticalMove >= 0 &&
      horizontalMove >= 0 &&
      verticalMove < board.length &&
      horizontalMove < board[0].length
    ) {
      result.push(board[verticalMove][horizontalMove]);
    }
  });

  return result;
};

export const buildBoard = (
  rows: number,
  columns: number,
  clickedRow: number,
  clickedColumn: number,
  mines: number
): Cell[][] => {
  if (mines > 0.9 * rows * columns) throw Error("To much mines for this board");

  const board = buildEmptyBoard(rows, columns);

  const wherePutMines = getMinesCells(rows, columns, mines, clickedRow, clickedColumn);

  putMines(board, wherePutMines);

  putNumbers(board);

  return board;
};

export const getCellsToReveal = (
  board: Cell[][],
  row: number,
  column: number,
  useRecursion = false
): Cell[] => {
  const result = useRecursion
    ? getCellsToRevealRecursion(board, row, column)
    : getCellsToRevealIterative(board, row, column);

  return result.filter(
    it =>
      it.Status !== CellStatus.DiscoveredAndEmpty && it.Status !== CellStatus.DiscoveredAndNumber
  );
};

export const boardFromString = (boardInput: string): Cell[][] => {
  const MINES_CHAR = "*";
  const ROW_DIVIDER_CHAR = "|";
  const NORMAL_CHAR = ".";

  const stringRows = boardInput.split(ROW_DIVIDER_CHAR).map(it => it.trim());

  const rows = stringRows.length;

  if (rows === 0) return [];

  const columns = stringRows[0].length;

  if (columns === 0) return [];

  const board = buildEmptyBoard(rows, columns);

  for (let r = 0; r < stringRows.length; r++) {
    const stringRow = stringRows[r];

    if (stringRow.length !== columns) throw new Error(`All rows must have same size. Row: ${r}`);

    for (let c = 0; c < stringRow.length; c++) {
      const charCell = stringRow[c];

      switch (charCell) {
        case MINES_CHAR:
          board[r][c].IsMine = true;
          break;
        case NORMAL_CHAR:
          break;
        default:
          throw new Error(
            `Character not allowed. Character: '${charCell}', at row: ${r}, column: ${c}`
          );
      }
    }
  }

  putNumbers(board);

  return board;
};

export const modifyBoard = (board: Cell[][], cellsToUpdate: Cell[]): Cell[][] => {
  if (isEmpty(cellsToUpdate)) return board;

  const result: Cell[][] = [];

  const grouped = groupBy(cellsToUpdate, it => it.Row);

  for (let r = 0; r < board.length; r++) {
    const row = board[r];

    if (!grouped[r]) {
      result.push(row);
    } else {
      const updateCellsByColumn = keyBy(grouped[r], it => it.Column);

      const newRow = [];
      for (let c = 0; c < row.length; c++) {
        const cell = row[c];

        if (!updateCellsByColumn[c]) {
          newRow.push(cell);
        } else {
          newRow.push(updateCellsByColumn[c]);
        }
      }

      result.push(newRow);
    }
  }

  return result;
};

const getMinesCells = (
  rows: number,
  columns: number,
  mines: number,
  rowAvoid: number,
  columnAvoid: number
) => {
  const cellsToPick = getPickCellList(rows, columns);
  const wherePutMines: [number, number][] = [];

  for (let i = 0; i < mines; i++) {
    const randomIndex = random(cellsToPick.length - 1);
    const cellTuple = cellsToPick[randomIndex];

    if (cellTuple[0] === rowAvoid && cellTuple[1] === columnAvoid) {
      i--;
      continue;
    }

    wherePutMines.push(cellTuple);

    cellsToPick.splice(randomIndex, 1);
  }

  return wherePutMines;
};

const getPickCellList = (rows: number, columns: number) => {
  const result: [number, number][] = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      result.push([ i, j ]);
    }
  }

  return result;
};

const putMines = (board: Cell[][], wherePutMines: [number, number][]) => {
  wherePutMines.forEach(([ row, column ]) => {
    board[row][column].IsMine = true;
  });
};

const putNumbers = (board: Cell[][]) => {
  const rows = board.length;
  const columns = board.length > 0 ? board[0].length : 0;

  for (let r = 0; r < rows; r++) {
    const row = board[r];

    for (let c = 0; c < columns; c++) {
      const cell = row[c];

      if (!cell.IsMine) {
        const minesAround = sumBy(getCellsAround(board, r, c), it => (it.IsMine ? 1 : 0));

        cell.MinesAround = minesAround;
      }
    }
  }
};

const getCellsToRevealRecursion = (
  board: Cell[][],
  row: number,
  column: number,
  marks: Map<string, boolean> = new Map<string, boolean>()
): Cell[] => {
  const cell = { ...board[row][column] };

  if (marks.has(cell.Key)) return [];

  if (cell.IsMine) throw Error("Can't revel mine cell");

  marks.set(cell.Key, true);
  const result = [ cell ];

  if (cell.MinesAround > 0) return result;

  getCellsAround(board, row, column).forEach(roundCell => {
    result.push(...getCellsToRevealRecursion(board, roundCell.Row, roundCell.Column, marks));
  });

  return result;
};

const getCellsToRevealIterative = (board: Cell[][], row: number, column: number): Cell[] => {
  const marks: Map<string, boolean> = new Map<string, boolean>();
  const initialCell = board[row][column];

  if (initialCell.IsMine) throw Error("Can't revel mine cell");

  const cellsToVisit = [ initialCell ];
  const result: Cell[] = [];
  marks.set(initialCell.Key, true);

  while (cellsToVisit.length > 0) {
    const currentCell = cellsToVisit.shift() as Cell;
    result.push({ ...currentCell });

    if (currentCell.MinesAround === 0) {
      getCellsAround(board, currentCell.Row, currentCell.Column)
        .filter(cell => !marks.has(cell.Key))
        .forEach(cell => {
          marks.set(cell.Key, true);
          cellsToVisit.push(cell);
        });
    }
  }

  return result;
};

enum DirectionRows {
  Up = -1,
  Stay = 0,
  Down = 1
}

enum DirectionColumns {
  Left = -1,
  Stay = 0,
  Right = 1
}

const directions: [DirectionRows, DirectionColumns][] = [
  [ DirectionRows.Up, DirectionColumns.Stay ],
  [ DirectionRows.Up, DirectionColumns.Right ],
  [ DirectionRows.Stay, DirectionColumns.Right ],
  [ DirectionRows.Down, DirectionColumns.Right ],
  [ DirectionRows.Down, DirectionColumns.Stay ],
  [ DirectionRows.Down, DirectionColumns.Left ],
  [ DirectionRows.Stay, DirectionColumns.Left ],
  [ DirectionRows.Up, DirectionColumns.Left ]
];
