import { Cell, buildCell, CellStatus } from "./cellHelper";

export const buildEmptyBoard = (rows: number, columns: number): Array<Cell[]> => {
  var result: Array<Cell[]> = [];

  for (let i = 0; i < rows; i++) {
    result[i] = [];

    for (let j = 0; j < columns; j++) {
      result[i][j] = buildCell(i, j);
    }
  }

  return result;
};

export const getCellsAround = (board: Array<Cell[]>, row: number, column: number): Cell[] => {
  const result: Cell[] = [];

  directions.forEach(([vertical, horizontal]: Direction) => {
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
): Array<Cell[]> => {
  if (mines > 0.9 * rows * columns) throw Error("To much mines for this board");

  const board = buildEmptyBoard(rows, columns);

  const wherePutMines = getMinesCells(rows, columns, mines, clickedRow, clickedColumn);

  putMines(board, wherePutMines);

  putNumbers(board);

  return board;
};

export const getCellsToReveal = (
  board: Array<Cell[]>,
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

export const boardFromString = (boardInput: string): Array<Cell[]> => {
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

export const modifyBoard = (board: Array<Cell[]>, cellsToUpdate: Cell[]): Array<Cell[]> => {
  if (!cellsToUpdate || cellsToUpdate.length === 0) return board;

  const result: Array<Cell[]> = [];

  const grouped = groupBy(cellsToUpdate, it => it.Row);

  for (let r = 0; r < board.length; r++) {
    const row = board[r];

    if (!grouped.has(r)) {
      result.push(row);
    } else {
      const updateCellsByColumn = keyBy(grouped.get(r)!, it => it.Column);

      const newRow = [];
      for (let c = 0; c < row.length; c++) {
        const cell = row[c];

        if (!updateCellsByColumn.has(c)) {
          newRow.push(cell);
        } else {
          newRow.push(updateCellsByColumn.get(c)!);
        }
      }

      result.push(newRow);
    }
  }

  return result;
};

function groupBy<T, V>(collection: Array<T>, selector: (item: T) => V)
{
  return collection.reduce((grouped: Map<V, Array<T>>, current: T) => { 
    const key = selector(current);
    if (grouped.has(key)) 
    {
      grouped.get(key)!.push(current);
    } 
    else 
    {
      grouped.set(key, [current]);
    }
    return grouped;
  }, new Map<V, Array<T>>())
}

function keyBy<T, V>(collection: Array<T>, selector: (item: T) => V)
{
  return collection.reduce((grouped: Map<V, T>, current: T) => { 
    const key = selector(current);
    grouped.set(key, current);
    return grouped;
  }, new Map<V, T>())
}

const getMinesCells = (
  rows: number,
  columns: number,
  mines: number,
  rowAvoid: number,
  columnAvoid: number
) => {
  const cellsToPick = getPickCellList(rows, columns);
  const wherePutMines: Array<[row: number, column: number]> = [];

  for (let i = 0; i < mines; i++) {
    const randomIndex = Math.floor(Math.random() * (cellsToPick.length - 1));
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
  const result: Array<[row: number, column: number]> = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      result.push([ i, j ]);
    }
  }

  return result;
};

const putMines = (board: Array<Cell[]>, wherePutMines: Array<[row: number, column: number]>) => {
  wherePutMines.forEach(([ row, column ]) => {
    board[row][column].IsMine = true;
  });
};

const putNumbers = (board: Array<Cell[]>) => {
  const rows = board.length;
  const columns = board.length > 0 ? board[0].length : 0;

  for (let r = 0; r < rows; r++) {
    const row = board[r];

    for (let c = 0; c < columns; c++) {
      const cell = row[c];

      if (!cell.IsMine) {
        const minesAround = getCellsAround(board, r, c)
          .reduce(
            (currentSum: number, cell: Cell) => currentSum + (cell.IsMine ? 1 : 0), 0
          );

        cell.MinesAround = minesAround;
      }
    }
  }
};

const getCellsToRevealRecursion = (
  board: Array<Cell[]>,
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

const getCellsToRevealIterative = (board: Array<Cell[]>, row: number, column: number): Cell[] => {
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

type Direction = [vertical: DirectionRows, horizontal: DirectionColumns];
const directions: Array<Direction> = [
  [ DirectionRows.Up, DirectionColumns.Stay ] as Direction,
  [ DirectionRows.Up, DirectionColumns.Right ] as Direction,
  [ DirectionRows.Stay, DirectionColumns.Right ] as Direction,
  [ DirectionRows.Down, DirectionColumns.Right ] as Direction,
  [ DirectionRows.Down, DirectionColumns.Stay ] as Direction,
  [ DirectionRows.Down, DirectionColumns.Left ] as Direction,
  [ DirectionRows.Stay, DirectionColumns.Left ] as Direction,
  [ DirectionRows.Up, DirectionColumns.Left ] as Direction
];
