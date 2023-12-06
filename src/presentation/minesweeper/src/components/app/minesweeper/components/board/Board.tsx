import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Cell } from "../../helpers/cellHelper";
import TableCell from "./TableCell";
import styles from "./styles";

const useStyles = makeStyles(styles);
const Board: React.FunctionComponent<BoardProps> = (props: BoardProps) => {
  const { board, discoverCell, toggleCellMark, discoverSurrounding } = props;

  const classes = useStyles();
  const rows = board.length;
  const columns = rows === 0 ? 0 : board[0].length;

  if (rows === 0 || columns === 0) return <table />;

  return (
    <div className={classes.tableContainer}>
      <table className={classes.table}>
        <tbody>
          {board.map(row => (
            <Row key={row[0].Key}
              row={row}
              discoverCell={discoverCell}
              toggleCellMark={toggleCellMark}
              discoverSurrounding={discoverSurrounding} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RowComponent = (props: RowProps) => {
  const { row, discoverCell, toggleCellMark, discoverSurrounding } = props;
  return (<tr key={row[0].Key}>
    {row.map(cell => (
      <TableCell
        key={cell.Key}
        cell={cell}
        discoverCell={discoverCell}
        toggleCellMark={toggleCellMark}
        discoverSurrounding={discoverSurrounding}
      />
    ))}
  </tr>);
}
const Row = React.memo(RowComponent);

export interface BoardProps {
  board: Array<Cell[]>;
  discoverCell: (cell: Cell) => void;
  toggleCellMark: (cell: Cell) => void;
  discoverSurrounding: (cell: Cell) => void;
}

export interface RowProps {
  row: Cell[];
  discoverCell: (cell: Cell) => void;
  toggleCellMark: (cell: Cell) => void;
  discoverSurrounding: (cell: Cell) => void;
}

export default React.memo(Board);
