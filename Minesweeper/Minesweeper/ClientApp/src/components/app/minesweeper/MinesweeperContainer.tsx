import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import Minesweeper from "./Minesweeper";
import { ApplicationState } from "../../../store";
import {
  getBoard,
  getIsFinished,
  getIsGameStarted,
  getStartTime,
  getFinishTime
} from "./_duck/selectors";
import {
  initialize,
  begin,
  cellClick,
  switchMarkAsMine,
  revealSurroundingNoMarkedMines
} from "./_duck/actions";
import { MinesweeperAction } from "./_duck/types";
import { Cell } from "./helpers/cellHelper";
import { IBoardConfiguration } from "./helpers/gameHelper";

function mapStateToProps(state: ApplicationState) {
  return {
    board: getBoard(state),
    gameEnded: getIsFinished(state),
    isStarted: getIsGameStarted(state),
    startTime: getStartTime(state),
    endTime: getFinishTime(state)
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<ApplicationState, unknown, MinesweeperAction>) {
  return {
    initialize: (configuration: IBoardConfiguration) => dispatch(initialize(configuration)),
    begin: (configuration: IBoardConfiguration, clickedCell: Cell) =>
      dispatch(begin(configuration, clickedCell.Row, clickedCell.Column)),
    click: (row: number, column: number) => dispatch(cellClick(row, column)),
    switchCell: (row: number, column: number) => dispatch(switchMarkAsMine(row, column)),
    surrounding: (row: number, column: number) =>
      dispatch(revealSurroundingNoMarkedMines(row, column))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Minesweeper);
