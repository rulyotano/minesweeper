import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Cell } from "./helpers/cellHelper";
import Board from "./components/board";
import {
  IBoardConfiguration
} from "./helpers/gameHelper";
import styles from "./styles";
import InfoBar from "./components/infoBar";
import SubmitRanking from "./components/ranking/SubmitRanking";

const useStyles = makeStyles(styles);

const Minesweeper: React.FunctionComponent<MinesweeperProps> = (props: MinesweeperProps) => {
  const {
    board,
    startTime,
    endTime,
    isStarted,
    isWin,
    isLost,
    initialize,
    begin,
    click,
    switchCell,
    surrounding,
    configuration,
    gameWon,
    minesLeft
  } = props;
  const classes = useStyles(props);

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
      <div className={classes.container}>
        <InfoBar time={{ startTime, endTime }} onReset={initializeWithConfiguration} gameState={{ isWin, isLost }} minesLeft={minesLeft}/>
        
        <Board
          board={board}
          discoverCell={cell =>
            isStarted ? click(cell.Row, cell.Column) : beginWithConfiguration(cell)}
          toggleCellMark={cell => switchCell(cell.Row, cell.Column)}
          discoverSurrounding={cell => surrounding(cell.Row, cell.Column)}
        />
      </div>
      <SubmitRanking isOpen={gameWon}/>
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
  configuration: IBoardConfiguration;
  gameWon: boolean;
  minesLeft: number;

  initialize: (configuration: IBoardConfiguration) => void;
  begin: (configuration: IBoardConfiguration, clickedCell: Cell) => void;
  click: (row: number, column: number) => void;
  switchCell: (row: number, column: number) => void;
  surrounding: (row: number, column: number) => void;
}

export default React.memo(Minesweeper);
