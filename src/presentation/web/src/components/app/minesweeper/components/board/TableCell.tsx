import React from "react";
import delay from "lodash/delay";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MinesIcon from "@material-ui/icons/Brightness5Outlined";
import FlagIcon from "@material-ui/icons/FlagOutlined";
import { Cell, CellStatus } from "../../helpers/cellHelper";
import styles from "./cellStyles";

const useStyles = makeStyles(styles);

const TableCell: React.FunctionComponent<TableCellProps> = props => {
  const { cell, discoverSurrounding, discoverCell, toggleCellMark } = props;

  const classes = useStyles(props);
  const [isLeftClicked, setIsLeftClicked] = React.useState(false);
  const [isRightClicked, setIsRightClicked] = React.useState(false);
  const [notUseMouseUp, setNotUseMouseUp] = React.useState(false);
  const currentTouchKey = React.useRef(0);

  const status = cell.Status;

  const resetMouseStatus = () => {
    setIsLeftClicked(false);
    setIsRightClicked(false);
    setNotUseMouseUp(false);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
    if (isLeftButton(e.button)) {
      if (isRightClicked) {
        discoverSurrounding(cell);
        setNotUseMouseUp(true);
      } else {
        setIsLeftClicked(true);
      }
    } else if (isRightButton(e.button)) {
      if (isLeftClicked) {
        discoverSurrounding(cell);
        setNotUseMouseUp(true);
      } else {
        setIsRightClicked(true);
      }
    }
  };
  const onMouseUp = (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
    if (!notUseMouseUp) {
      if (isLeftButton(e.button)) {
        discoverCell(cell);
      } else if (isRightButton(e.button)) {
        toggleCellMark(cell);
      }
    }
    resetMouseStatus();
  };
  const onDoubleClick = (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
    discoverSurrounding(cell);
  };

  const onContextMenu = (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
    e.preventDefault();
  };

  const onLongTouch = () => {
    if (cell.Status === CellStatus.DiscoveredAndNumber) discoverSurrounding(cell);
    else toggleCellMark(cell);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLTableDataCellElement>) => {
    const currentTouch = currentTouchKey.current;
    delay(() => {
      if (currentTouch === currentTouchKey.current) {
        onLongTouch();
      }
    }, TOUCH_WAIT_MS);
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLTableDataCellElement>) => {
    currentTouchKey.current += 1;
  };

  const isLeftButton = (eventButton: number) => eventButton === 0 || eventButton === 1;
  const isRightButton = (eventButton: number) => eventButton === 2;

  return (
    <td
      className={classes.cell}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={classes.cellContent}>
        {status === CellStatus.DiscoveredAndNumber ? (
          <Typography id="cell-number">{cell.MinesAround}</Typography>
        ) : null}

        {status === CellStatus.Mine ? <MinesIcon id="mine" /> : null}

        {status === CellStatus.MarkedAsMine ? <FlagIcon id="flag" /> : null}

        {status === CellStatus.MarkedAsMineButEmpty ? <MinesIcon id="wrong-flag" /> : null}

        {status === CellStatus.ExploitedMine ? <MinesIcon id="mine-explosion" /> : null}
      </div>
    </td>
  );
};

export interface TableCellProps {
  cell: Cell;
  discoverCell: (cell: Cell) => void;
  toggleCellMark: (cell: Cell) => void;
  discoverSurrounding: (cell: Cell) => void;
}

const TOUCH_WAIT_MS = 300;

export default React.memo(TableCell);
