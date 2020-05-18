import { Cell, CellStatus } from "./cellStates";

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

export default {
  buildBoard(rows: Number, columns: Number): Cell[][] {
    var result: Cell[][] = [];

    for (let i = 0; i < rows; i++) {
      result[i] = [];

      for (let j = 0; j < columns; j++) {
        result[i][j] = {
          Status: CellStatus.UnDiscovered,
          NumberValue: 0,
          Key: `${i}-${j}`
        };
      }
    }

    return result;
  },

  getCellsAround(board: Cell[][], row: number, column: number): Cell[] {
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
  }
};
