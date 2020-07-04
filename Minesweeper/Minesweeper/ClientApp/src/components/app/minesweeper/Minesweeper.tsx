import React from "react";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import { Cell } from "./helpers/cellHelper";
import Board from "./components/board";
import {
  gameConfigurations,
  IBoardConfiguration,
  calculateTimeElapsed
} from "./helpers/gameHelper";

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

  const [ currentTime, setCurrentTime ] = React.useState(0);
  const calculateTimeParams = {
    startTime,
    endTime
  };
  const calculateTimeParamsRef = React.useRef(calculateTimeParams);
  calculateTimeParamsRef.current = calculateTimeParams;
  const configuration = gameConfigurations.beginner;

  const initializeWithConfiguration = () => initialize(configuration);

  const beginWithConfiguration = (clickedCell: Cell) => begin(configuration, clickedCell);

  React.useEffect(
    () => {
      initializeWithConfiguration();

      const intervalId = setInterval(() => {
        const { startTime, endTime } = calculateTimeParamsRef.current;
        setCurrentTime(calculateTimeElapsed(startTime, endTime));
      }, ONE_SECOND_MS);

      return () => clearInterval(intervalId);
    },
    // eslint-disable-next-line
    [ initialize ]
  );

  return (
    <div>
      <p>Time: {currentTime}</p>

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

const ONE_SECOND_MS = 1000;

export default Minesweeper;
