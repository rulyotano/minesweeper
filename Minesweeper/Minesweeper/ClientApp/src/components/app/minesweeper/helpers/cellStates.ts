export interface Cell {
    Status: CellStatus,
    NumberValue: Number,
    Key: String
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