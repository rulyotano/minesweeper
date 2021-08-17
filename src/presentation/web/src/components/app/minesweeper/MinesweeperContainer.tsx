import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Minesweeper from "./Minesweeper";
import {
  getBoard,
  getIsFinished,
  getIsGameStarted,
  getStartTime,
  getFinishTime,
  getIsGameWon,
  getIsGameLost
} from "./_duck/selectors";
import {
  initialize,
  begin,
  cellClick,
  switchMarkAsMine,
  revealSurroundingNoMarkedMines
} from "./_duck/actions";
import { Cell } from "./helpers/cellHelper";
import { IBoardConfiguration } from "./helpers/gameHelper";

const MinesweeperContainer: React.FunctionComponent = () => {
  const board = useSelector(getBoard);
  const gameEnded = useSelector(getIsFinished);
  const isStarted = useSelector(getIsGameStarted);
  const startTime = useSelector(getStartTime);
  const endTime = useSelector(getFinishTime);
  const isWin = useSelector(getIsGameWon);
  const isLost = useSelector(getIsGameLost);

  const dispatch = useDispatch();

  const onInitialize = React.useCallback(
    (configuration: IBoardConfiguration) => dispatch(initialize(configuration)),
    [ dispatch ]
  );
  const onBegin = React.useCallback(
    (configuration: IBoardConfiguration, clickedCell: Cell) =>
      dispatch(begin(configuration, clickedCell.Row, clickedCell.Column)),
    [ dispatch ]
  );
  const click = React.useCallback(
    (row: number, column: number) => dispatch(cellClick(row, column)),
    [ dispatch ]
  );
  const switchCell = React.useCallback(
    (row: number, column: number) => dispatch(switchMarkAsMine(row, column)),
    [ dispatch ]
  );
  const surrounding = React.useCallback(
    (row: number, column: number) => dispatch(revealSurroundingNoMarkedMines(row, column)),
    [ dispatch ]
  );

  return (
    <Minesweeper
      board={board}
      gameEnded={gameEnded}
      isStarted={isStarted}
      startTime={startTime}
      endTime={endTime}
      initialize={onInitialize}
      begin={onBegin}
      click={click}
      switchCell={switchCell}
      surrounding={surrounding}
      isWin={isWin}
      isLost={isLost}
    />
  );
};

export default MinesweeperContainer;
