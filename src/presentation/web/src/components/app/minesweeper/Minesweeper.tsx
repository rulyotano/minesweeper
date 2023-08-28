import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Cell } from "./helpers/cellHelper";
import Board from "./components/board";
import {
  IBoardConfiguration
} from "./helpers/gameHelper";
import styles from "./styles";
import InfoBar from "./components/infoBar";
import ViewRanking from "./components/ranking/ViewRanking";
import Button from "@material-ui/core/Button";
import RankingIcon from "@material-ui/icons/Stars";
import SubmitRanking from "./components/ranking/SubmitRanking";

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
    surrounding,
    configuration
  } = props;

  const [isViewRankingOpen, setIsViewRankingOpen] = React.useState(false);

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
        <Button onClick={() => setIsViewRankingOpen(true)}>Ranking <RankingIcon /></Button>
        <InfoBar time={{ startTime, endTime }} onReset={initializeWithConfiguration} gameState={{ isWin, isLost }} />

        <Board
          board={board}
          discoverCell={cell =>
            isStarted ? click(cell.Row, cell.Column) : beginWithConfiguration(cell)}
          toggleCellMark={cell => switchCell(cell.Row, cell.Column)}
          discoverSurrounding={cell => surrounding(cell.Row, cell.Column)}
        />
      </div>
      <ViewRanking isOpen={isViewRankingOpen} onClose={() => setIsViewRankingOpen(false)} />
      <SubmitRanking />
    </div>
  );
};

export interface MinesweeperProps {
  board: Array<string[]>;
  gameEnded: boolean;
  isStarted: boolean;
  startTime: Date | null;
  endTime: Date | null;
  isWin: boolean;
  isLost: boolean;
  configuration: IBoardConfiguration;

  initialize: (configuration: IBoardConfiguration) => void;
  begin: (configuration: IBoardConfiguration, clickedCell: Cell) => void;
  click: (row: number, column: number) => void;
  switchCell: (row: number, column: number) => void;
  surrounding: (row: number, column: number) => void;
}

export default React.memo(Minesweeper);
