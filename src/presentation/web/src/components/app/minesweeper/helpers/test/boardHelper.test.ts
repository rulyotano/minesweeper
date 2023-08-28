import deepFreeze from "deep-freeze";
import {
  buildEmptyBoard,
  getCellsAround,
  buildBoard,
  boardFromString,
  getCellsToReveal
} from "../boardHelper";
import { CellStatus } from "../cellHelper";

describe("src > components > minesweeper > helpers > boardHelper", () => {
  beforeEach(() => {});

  afterEach(() => {});

  test("buildEmptyBoard should build a board with such rows and columns and initial state = undiscovered", () => {
    const ROWS = 7;
    const COLUMNS = 9;

    const [board, boardCells] = buildEmptyBoard(ROWS, COLUMNS);

    expect(board).toHaveLength(ROWS);
    board.forEach(row => {
      expect(row).toHaveLength(COLUMNS);

      row.forEach(cell => expect(boardCells[cell].Status).toBe(CellStatus.UnDiscovered));
    });
  });

  describe("getCellsAround()", () => {
    const [fakeBoard, fakeBoardCells] = buildEmptyBoard(3, 3);
    // x, 0, 1, 2
    // 0, x, x, x
    // 1, x, x, x
    // 2, x, x, x

    const testGetCellsAround = (
      desc: string,
      row: number,
      colum: number,
      expectedCellKeys: string[]
    ) => {
      test(`${desc}: should match expected`, () => {
        const result = getCellsAround(fakeBoard, fakeBoardCells, row, colum);

        expect(result).toHaveLength(expectedCellKeys.length);

        result.forEach((it, index) => expect(it.Key).toEqual(expectedCellKeys[index]));
      });
    };

    testGetCellsAround("In the middle should return all the 8", 1, 1, [
      "0-1",
      "0-2",
      "1-2",
      "2-2",
      "2-1",
      "2-0",
      "1-0",
      "0-0"
    ]);

    testGetCellsAround("In the top-left corner should ONLY return 3", 0, 0, [
      "0-1",
      "1-1",
      "1-0"
    ]);

    testGetCellsAround("In the top-right corner should ONLY return 3", 0, 2, [
      "1-2",
      "1-1",
      "0-1"
    ]);

    testGetCellsAround("In the bottom-right corner should ONLY return 3", 2, 2, [
      "1-2",
      "2-1",
      "1-1"
    ]);

    testGetCellsAround("In the bottom-side should return 5", 2, 1, [
      "1-1",
      "1-2",
      "2-2",
      "2-0",
      "1-0"
    ]);
  });

  describe("buildBoard()", () => {
    const ROWS = 7;
    const COLUMNS = 9;

    test("should generate board with the dimensions and status undiscovered", () => {
      var [board, boardCells] = buildBoard(ROWS, COLUMNS, 0, 0, 10);

      expect(board).toHaveLength(ROWS);
      board.forEach(row => {
        expect(row).toHaveLength(COLUMNS);
        row.forEach(cellKey => expect(boardCells[cellKey].Status).toBe(CellStatus.UnDiscovered));
      });
    });

    test("should generate board with the correct amount of mines", () => {
      const testMines = [ 9, 10, 11, 34 ];

      testMines.forEach(mines => {
        const [board, boardCells] = buildBoard(ROWS, COLUMNS, 0, 0, mines);

        let minesLeft = mines;

        for (let r = 0; r < board.length; r++) {
          for (let c = 0; c < board[r].length; c++) {
            const cell = boardCells[board[r][c]];

            if (cell.IsMine) minesLeft--;
          }
        }

        expect(minesLeft).toEqual(0);
      });
    });

    test("boards should be random (not equals between all others generated", () => {
      const testMines = [ 9, 10, 11, 34 ];
      const boardsMap = new Map<String, boolean>();

      testMines.forEach(mines => {
        const [_, boardCells] = buildBoard(ROWS, COLUMNS, 0, 0, mines);
        const boardCellsText = JSON.stringify(boardCells);

        expect(boardsMap.has(boardCellsText)).toBeFalsy();
        boardsMap.set(boardCellsText, true);
      });
    });

    test("board should never put mine on initial clicked point", () => {
      const testMines = 6;
      const clickedRow = 1;
      const clickedColumn = 1;

      for (let i = 0; i < 15; i++) {
        const [board, boardCells] = buildBoard(3, 3, clickedRow, clickedColumn, testMines);

        expect(boardCells[board[clickedRow][clickedColumn]].IsMine).toBeFalsy();
      }
    });

    test("each number should have the respective number of mires around it", () => {
      var [board, boardCells] = buildBoard(ROWS, COLUMNS, 3, 3, 15);

      for (let r = 0; r < ROWS; r++) {
        const row = board[r];

        for (let c = 0; c < COLUMNS; c++) {
          const cell = boardCells[row[c]];

          if (!cell.IsMine) {
            const minesAround = getCellsAround(board, boardCells, r, c).reduce((sum, cell) => sum + (cell.IsMine ? 1 : 0), 0);

            expect(cell.MinesAround).toBe(minesAround);
          }
        }
      }
    });
  });

  describe("boardFromString()", () => {
    test("case 1. should ", () => {
      const boardString = `..*|
                           ...|
                           .*.`;

      const [board, boardCells] = boardFromString(boardString);
      expect(boardCells[board[0][0]].IsMine).toBeFalsy();
      expect(boardCells[board[0][1]].IsMine).toBeFalsy();
      expect(boardCells[board[0][2]].IsMine).toBeTruthy();
      expect(boardCells[board[1][0]].IsMine).toBeFalsy();
      expect(boardCells[board[1][1]].IsMine).toBeFalsy();
      expect(boardCells[board[1][2]].IsMine).toBeFalsy();
      expect(boardCells[board[2][0]].IsMine).toBeFalsy();
      expect(boardCells[board[2][1]].IsMine).toBeTruthy();
      expect(boardCells[board[2][2]].IsMine).toBeFalsy();
      expect(boardCells[board[1][1]].MinesAround).toBe(2);
      expect(boardCells[board[0][0]].MinesAround).toBe(0);
      expect(boardCells[board[2][2]].MinesAround).toBe(1);
      expect(boardCells[board[1][2]].MinesAround).toBe(2);
    });
  });

  describe("getCellsToReveal()", () => {
    const boardString1 = `*....|
                          .*...|
                          *...*|
                          *....|
                          ....*`;

    const boardString2 = `*.........|
                           ..........|
                           ..*.......|
                           ..........|
                           ..........|
                           ..........|
                           ........*.|
                           ..........|
                           ..*.......|
                           ..........`;

    const boardString3 = `*.....................|
                          ......................|
                          ..*...................|
                          ......................|
                          ......................|
                          ......................|
                          ........*.............|
                          ......................|
                          ..*...................|
                          ......................`;

    test("case click on (4,0) return 1 cell", () => {
      const [board, boardCells] = boardFromString(boardString1);

      deepFreeze(board);
      deepFreeze(boardCells);
      const result = getCellsToReveal(board, boardCells, 4, 0);

      expect(result).toHaveLength(1);
      expect(result[0].Key).toBe("4-0");
      expect(result[0].MinesAround).toBe(1);
    });

    test("case click on (0,4) return 6 cell", () => {
      const [board, boardCells] = boardFromString(boardString1);

      deepFreeze(board);
      deepFreeze(boardCells);
      const result = getCellsToReveal(board, boardCells, 0, 4);

      expect(result).toHaveLength(6);

      const resultKeys = result.map(it => it.Key);

      expect(resultKeys).toContain("0-4");
      expect(resultKeys).toContain("1-4");
      expect(resultKeys).toContain("1-3");
      expect(resultKeys).toContain("1-2");
      expect(resultKeys).toContain("0-2");
      expect(resultKeys).toContain("0-3");
      expect(resultKeys).toContain("0-4");
    });

    test("case click on (0,4), but exist overlap (one of the cells to reveal was already revealed) return 5 cell", () => {
      const [board, boardCells] = boardFromString(boardString1);
      boardCells[board[1][4]].Status = CellStatus.DiscoveredAndNumber;

      deepFreeze(board);
      deepFreeze(boardCells);
      const result = getCellsToReveal(board, boardCells, 0, 4);

      expect(result).toHaveLength(5);

      const resultKeys = result.map(it => it.Key);

      expect(resultKeys).toContain("0-4");
      expect(resultKeys).not.toContain("1-4");
      expect(resultKeys).toContain("1-3");
      expect(resultKeys).toContain("1-2");
      expect(resultKeys).toContain("0-2");
      expect(resultKeys).toContain("0-3");
      expect(resultKeys).toContain("0-4");
    });

    test("case click on (3,2) return 8 cell Iterative", () => {
      const [board, boardCells] = boardFromString(boardString1);

      deepFreeze(board);
      deepFreeze(boardCells);
      const result = getCellsToReveal(board, boardCells, 3, 2);

      expect(result).toHaveLength(9);

      const resultKeys = result.map(it => it.Key);

      expect(resultKeys).toContain("4-2");
      expect(resultKeys).toContain("4-1");
      expect(resultKeys).toContain("4-3");
      expect(resultKeys).toContain("3-2");
      expect(resultKeys).toContain("3-1");
      expect(resultKeys).toContain("3-3");
      expect(resultKeys).toContain("2-1");
      expect(resultKeys).toContain("2-2");
      expect(resultKeys).toContain("2-3");
    });

    test("big board(2) (5,2) iterative", () => {
      const [board, boardCells] = boardFromString(boardString2);

      deepFreeze(board);
      deepFreeze(boardCells);
      getCellsToReveal(board, boardCells, 5, 2);
    });

    test("big board(3) (0,17) iterative", () => {
      const [board, boardCells] = boardFromString(boardString3);

      deepFreeze(board);
      deepFreeze(boardCells);
      getCellsToReveal(board, boardCells, 0, 17);
    });

    test("modify returned cells should not modify the original board", () => {
      const [board, boardCells] = boardFromString(boardString1);

      deepFreeze(board);
      const result1 = getCellsToReveal(board, boardCells, 3, 2);
      const result2 = getCellsToReveal(board, boardCells,3, 2);

      result1.forEach(it => {
        it.MinesAround = 32;
      });
      result2.forEach(it => {
        it.MinesAround = 32;
      });
    });
  });
});
