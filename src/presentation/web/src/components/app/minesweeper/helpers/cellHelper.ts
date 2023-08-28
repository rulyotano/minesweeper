export interface Cell {
  Status: CellStatus;
  Key: string;
  MinesAround: number;
  IsMine: boolean;
  Row: number;
  Column: number;
}

export enum CellStatus {
  UnDiscovered,
  DiscoveredAndEmpty,
  DiscoveredAndNumber,
  MarkedAsMine,
  ExploitedMine,
  Mine,
  MarkedAsMineButEmpty
}

export const getCellKey = (row: number, column: number) => `${row}-${column}`;

export const buildCell = (
  row: number,
  column: number,
  status = CellStatus.UnDiscovered,
  minesAround: number = 0,
  isMine = false
): Cell => ({
  Status: status,
  MinesAround: minesAround,
  IsMine: isMine,
  Key: getCellKey(row, column),
  Row: row,
  Column: column
});

export const changeCellStatus = (cell: Cell, newStatus: CellStatus): Cell => ({
  ...cell,
  Status: newStatus
});
