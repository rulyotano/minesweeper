import boardHelper from "../boardHelper";
import { CellStatus, Cell } from "../cellStates";

describe("src > components > minesweeper > helpers > boardHelper", () => {
  beforeEach(() => {});

  afterEach(() => {});

  test("buildBoard should build a board with such rows and columns and initial state = undiscovered", () => {
    const ROWS = 7;
    const COLUMNS = 9;

    var board = boardHelper.buildBoard(ROWS, COLUMNS);

    expect(board).toHaveLength(ROWS);
    board.forEach(row => {
      expect(row).toHaveLength(COLUMNS);

      row.forEach(cell => expect(cell.Status).toBe(CellStatus.UnDiscovered));
    });
  });

  describe("getCellsAround()", () => {
    const fakeBoard: Cell[][] = boardHelper.buildBoard(3, 3);
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
        const result = boardHelper.getCellsAround(fakeBoard, row, colum);

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
});
