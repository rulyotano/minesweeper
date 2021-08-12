import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Cell } from "./helpers/cellHelper";
import Board from "./components/board";
import {
  gameConfigurations,
  IBoardConfiguration
} from "./helpers/gameHelper";
import styles from "./styles";
import InfoBar from "./components/infoBar";

const useStyles = makeStyles(styles);

const Minesweeper: React.FunctionComponent<MinesweeperProps> = (props: MinesweeperProps) => {
  const {
    board,
    startTime,
    endTime,
    // gameEnded,
    isStarted,
    isWin,
    isLost,
    initialize,
    begin,
    click,
    switchCell,
    surrounding
  } = props;

  const classes = useStyles(props);

  const configuration = gameConfigurations.beginner;

  const initializeWithConfiguration = () => initialize(configuration);

  const beginWithConfiguration = (clickedCell: Cell) => begin(configuration, clickedCell);

  React.useEffect(
    () => {
      initializeWithConfiguration();
    },
    // eslint-disable-next-line
    [initialize]
  );

  return (
    <div className={classes.centeredContainer}>
      <div>
        <InfoBar time={{ startTime, endTime }} onReset={initializeWithConfiguration} gameState={{ isWin, isLost }} />
        
        <Board
          board={board}
          discoverCell={cell =>
            isStarted ? click(cell.Row, cell.Column) : beginWithConfiguration(cell)}
          toggleCellMark={cell => switchCell(cell.Row, cell.Column)}
          discoverSurrounding={cell => surrounding(cell.Row, cell.Column)}
        />
      </div>
    </div>
  );
};

export interface MinesweeperProps {
  board: Cell[][];
  gameEnded: boolean;
  isStarted: boolean;
  startTime: Date | null;
  endTime: Date | null;
  isWin: boolean;
  isLost: boolean;

  initialize: (configuration: IBoardConfiguration) => void;
  begin: (configuration: IBoardConfiguration, clickedCell: Cell) => void;
  click: (row: number, column: number) => void;
  switchCell: (row: number, column: number) => void;
  surrounding: (row: number, column: number) => void;
}

export default React.memo(Minesweeper);
