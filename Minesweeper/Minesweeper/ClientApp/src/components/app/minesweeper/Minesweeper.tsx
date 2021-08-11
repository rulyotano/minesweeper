import React from "react";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Cell } from "./helpers/cellHelper";
import Board from "./components/board";
import ElapsedSeconds from "./components/ElapsedSeconds";
import {
  gameConfigurations,
  IBoardConfiguration
} from "./helpers/gameHelper";
import styles from "./styles";

const useStyles = makeStyles(styles);

const Minesweeper: React.FunctionComponent<MinesweeperProps> = (props: MinesweeperProps) => {
  const {
    board,
    startTime,
    endTime,
    gameEnded,
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
    [ initialize ]
  );

  return (
    <div className={classes.centeredContainer}>
      <div>
        <p>
          Time: <ElapsedSeconds startTime={startTime} endTime={endTime} />
        </p>

        {gameEnded ? <Button onClick={initializeWithConfiguration}>Re-start</Button> : null}

        {isWin ? <Typography>Congrats!!! You Win!!!</Typography> : null}
        {isLost ? <Typography>You Lost. Try another more time!!!</Typography> : null}

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
