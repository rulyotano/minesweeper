import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import MinesIcon from "@material-ui/icons/Brightness5Outlined";
import styles from "./styles";
import ElapsedSeconds from "../../components/ElapsedSeconds";

const useStyles = makeStyles(styles);
const InfoBar: React.FunctionComponent<InfoBarProps> = (props: InfoBarProps) => {
  const { time: { startTime, endTime }, onReset, gameState, minesLeft } = props;

  const classes = useStyles();
  const buttonIcon = getEmojiFromGameState(gameState);

  return (
    <div className={classes.infoBarContainer}>
      <div className={classes.lineCentered}>
        <HourglassEmptyIcon /> 
        <div className={classes.timeTextContainer}><ElapsedSeconds startTime={startTime} endTime={endTime} /></div>
      </div>
      <div>
        <Button variant="contained" onClick={onReset}>
          {buttonIcon}
        </Button>
      </div>
      <div className={classes.minesLeftContainer}>
        <div className={classes.timeTextContainer}>{minesLeft}</div>
        <MinesIcon /> 
      </div>
    </div>
  );
};

const getEmojiFromGameState = (gameState: GameState) => {
  if (gameState.isWin) return "😎";
  if (gameState.isLost) return "😫";
  return "🙂";
}

export interface GameState {
  isWin: boolean,
  isLost: boolean
}

export interface TimeState {
  startTime: Date | null,
  endTime: Date | null
}


export interface InfoBarProps {
  minesLeft: number,
  time: TimeState,
  gameState: GameState,
  onReset: () => void
}

export default InfoBar;
