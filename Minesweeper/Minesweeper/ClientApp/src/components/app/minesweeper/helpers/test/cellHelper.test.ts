import deepFreeze from "deep-freeze";
import { buildCell, CellStatus, changeCellStatus } from "../cellHelper";

describe("src > components > minesweeper > helpers > cellHelper", () => {
  beforeEach(() => {});

  afterEach(() => {});

  describe("buildCell()", () => {
    const ROW = 3;
    const COLUMN = 4;

    test("should create a cell with the specified properties", () => {
      const customStatus = CellStatus.ExploitedMine;
      const customMinesAround = 6;
      const customIsMine = true;

      const cell = buildCell(ROW, COLUMN, customStatus, customMinesAround, customIsMine);

      expect(cell.Row).toBe(ROW);
      expect(cell.Column).toBe(COLUMN);
      expect(cell.Status).toBe(customStatus);
      expect(cell.MinesAround).toBe(customMinesAround);
      expect(cell.IsMine).toBe(customIsMine);
      expect(cell.Key).toBe(`${ROW}-${COLUMN}`);
    });

    test("default values should create a cell expected properties", () => {
      const cell = buildCell(ROW, COLUMN);

      expect(cell.Row).toBe(ROW);
      expect(cell.Column).toBe(COLUMN);
      expect(cell.Status).toBe(CellStatus.UnDiscovered);
      expect(cell.MinesAround).toBe(0);
      expect(cell.IsMine).toBe(false);
    });
  });

  test("changeCellStatus should return modified cell without mutate input", () => {
    const cell = buildCell(0, 0);

    deepFreeze(cell);
    const NEW_STATUS = CellStatus.ExploitedMine;

    const newCell = changeCellStatus(cell, NEW_STATUS);

    expect(newCell).toEqual({ ...cell, Status: NEW_STATUS });
  });
});
