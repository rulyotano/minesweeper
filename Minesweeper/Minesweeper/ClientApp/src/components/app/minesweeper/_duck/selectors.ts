import { createSelector } from "reselect";
import { ApplicationState } from "../../../../../src/store";

const getState = (state: ApplicationState) => state.minesweeper;

export const getRows = (state: ApplicationState) => getState(state).rows;
export const getColumns = (state: ApplicationState) => getState(state).columns;
export const getIsGameStarted = (state: ApplicationState) => getState(state).gameIsStarted;
export const getStartTime = (state: ApplicationState) => getState(state).gameStartTime;
export const getFinishTime = (state: ApplicationState) => getState(state).gameFinishTime;
export const getMines = (state: ApplicationState) => getState(state).mines;
export const getDiscovered = (state: ApplicationState) => getState(state).discoveredCells;
export const getBoard = (state: ApplicationState) => getState(state).board;

export const getIsFinished = createSelector([ getFinishTime ], finishTime => {
  return Boolean(finishTime);
});
