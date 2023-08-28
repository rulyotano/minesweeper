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
            <tr key={row[0]}>
              {row.map(cell => (
                <TableCell
                  key={cell}
                  cellKey={cell}
                  discoverCell={discoverCell}
                  toggleCellMark={toggleCellMark}
                  discoverSurrounding={discoverSurrounding}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export interface BoardProps {
  board: Array<string[]>;
  discoverCell: (cell: Cell) => void;
  toggleCellMark: (cell: Cell) => void;
  discoverSurrounding: (cell: Cell) => void;
}

export default React.memo(Board);
