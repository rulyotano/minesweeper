import { createSelector } from "reselect";
import { ApplicationState } from "../../../../../src/store";
import { gameConfigurationsCollection } from "../helpers/gameHelper";

const getState = (state: ApplicationState) => state.minesweeper;

export const getRows = (state: ApplicationState) => getState(state).rows;
export const getColumns = (state: ApplicationState) => getState(state).columns;
export const getStartTime = (state: ApplicationState) => getState(state).gameStartTime;
export const getFinishTime = (state: ApplicationState) => getState(state).gameFinishTime;
export const getMines = (state: ApplicationState) => getState(state).mines;
export const getDiscovered = (state: ApplicationState) => getState(state).discoveredCells;
export const getBoard = (state: ApplicationState) => getState(state).board;

export const getIsGameStarted = createSelector(
  [ getStartTime, getFinishTime ],
  (startTime, endTime) => Boolean(startTime) && !Boolean(endTime)
);

export const getIsGameInitialized = createSelector(
  [ getStartTime, getFinishTime ],
  (startTime, endTime) => !Boolean(startTime) && !Boolean(endTime)
);

export const getIsFinished = createSelector([ getFinishTime ], finishTime => {
  return Boolean(finishTime);
});

export const getIsGameWon = createSelector(
  [ getRows, getColumns, getMines, getDiscovered ],
  (rows, columns, mines, discovered) => rows * columns === mines + discovered
);

export const getIsGameLost = createSelector(
  [ getIsGameWon, getIsFinished ],
  (isGameWon, isGameFinished) => isGameFinished && !isGameWon
);

export const getGameLevel = createSelector(
  [ getRows, getColumns ],
  (rows, columns) => gameConfigurationsCollection.getConfiguration(rows, columns)
);
