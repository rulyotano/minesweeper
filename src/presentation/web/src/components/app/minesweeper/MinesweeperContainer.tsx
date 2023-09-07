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
  getIsGameLost,
  getRows,
  getColumns
} from "./_duck/selectors";
import {
  initialize,
  begin,
  cellClick,
  switchMarkAsMine,
  revealSurroundingNoMarkedMines,
  setUsername
} from "./_duck/actions";
import { Cell } from "./helpers/cellHelper";
import { IBoardConfiguration, gameConfigurationsCollection } from "./helpers/gameHelper";
import { USERNAME_STORAGE_KEY } from "./_duck/types";

interface MinesweeperContainerProps {
  gameWon?: boolean
}

const MinesweeperContainer = (props: MinesweeperContainerProps) => {
  const { gameWon = false } = props;
  const board = useSelector(getBoard);
  const gameEnded = useSelector(getIsFinished);
  const isStarted = useSelector(getIsGameStarted);
  const startTime = useSelector(getStartTime);
  const endTime = useSelector(getFinishTime);
  const isWin = useSelector(getIsGameWon);
  const isLost = useSelector(getIsGameLost);
  const rows = useSelector(getRows);
  const columns = useSelector(getColumns);
  const currentConfig = gameConfigurationsCollection.getConfiguration(rows, columns);

  const dispatch = useDispatch();

  React.useEffect(() => {
    const usernameFromLocalStorage = localStorage.getItem(USERNAME_STORAGE_KEY);
    if (usernameFromLocalStorage)
    {
      dispatch(setUsername(usernameFromLocalStorage));
    }
  }, [dispatch]);

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
      configuration={currentConfig}
      gameWon={gameWon}
    />
  );
};

export default MinesweeperContainer;
