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
  Key: `${row}-${column}`,
  Row: row,
  Column: column
});
