import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Dialog from "@material-ui/core/Dialog"
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogTitle from "./DialogTitle"
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getFinishTime, getGameLevel, getIsBoardSubmitted, getIsGameWon, getStartTime } from "../../_duck/selectors";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { apiClient, getDeviceType } from "../../../../../common";
import { setTimeout } from "timers";
import styles from "./styles";
import { SubmitKeyHelper } from "./keys";
import { markBoardSubmittedAction } from "../../_duck/actions";

const useStyles = makeStyles(styles);

interface SubmitRankingProps {
  isOpen: boolean
}

export default (props: SubmitRankingProps) => {
  const {isOpen} = props;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const classes = useStyles();
  const gameLevel = useSelector(getGameLevel);
  const startTimeMs = SubmitKeyHelper.getDateSecond(useSelector(getStartTime));
  const finishTimeMs = SubmitKeyHelper.getDateSecond(useSelector(getFinishTime), startTimeMs);
  const isGameWon = useSelector(getIsGameWon);
  const isBoardAlreadySubmitted = useSelector(getIsBoardSubmitted);
  const dispatch = useDispatch();
  const history = useHistory();
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const gameState = React.useMemo(() => isOpen ? SubmitKeyHelper.getSavedGameState() : {
    startedMs: startTimeMs,
    finishedMs: finishTimeMs,
    level: gameLevel,
    creationTime: 0
  }, [isOpen, startTimeMs, finishTimeMs, gameLevel]);

  const onClose = React.useCallback(() => {
    SubmitKeyHelper.clearSavedGameState();
    dispatch(markBoardSubmittedAction());
    history.push("/");
  }, [history, dispatch]);

  const onOpen = React.useCallback(() => {
    if (!gameState) return;
    SubmitKeyHelper.saveGameState(gameState);
    history.push("/game-won");
  }, [gameState, history]);

  const durationMs = gameState!.finishedMs - gameState!.startedMs;
  const durationS = durationMs / 1000.0;
  const device = React.useMemo(() => getDeviceType(), []);

  React.useEffect(() => {
    if (!isBoardAlreadySubmitted && isGameWon && startTimeMs !== finishTimeMs) onOpen();
  }, [isBoardAlreadySubmitted, isGameWon, startTimeMs, finishTimeMs, onOpen]);

  const gameSize = gameState?.level?.name || "beginner";
  const username = user?.nickname;
  const onSubmit = React.useCallback(() => {
    if (!isAuthenticated) return;
    setIsSubmitting(true);
    apiClient.put("ranking", {
      timeInMs: durationMs,
      username: username,
      gameSize: gameSize,
      device: device
    })
      .then(() => {
        onClose();
      })
      .finally(() => setIsSubmitting(false));
  }, [isAuthenticated, durationMs, username, gameSize, device, onClose])

  const onLogin = React.useCallback(() => {
    loginWithRedirect(
      {
        appState: {
          returnTo: "/game-won"
        }
      });
  }, [loginWithRedirect]);

  React.useEffect(() => {
    setTimeout(() => document.body.style.overflow = (isOpen ? "hidden" : "unset"), 1);
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && (durationMs === 0 || !gameState)) {
      onClose();
    }
  }, [isOpen, durationMs, gameState, onClose])

  return (<Dialog fullWidth={true} maxWidth="sm" onClose={onClose} aria-labelledby="Ranking Submit" open={isOpen}>
    <DialogTitle id="submit-ranking-dialog-title" onClose={onClose}>
      You beat Minesweeper at level "{gameSize}" on a "{device}" device
    </DialogTitle>

    <DialogContent dividers>
      Congrats!!! <span role="img" aria-label="win">😎</span>
      You won the Minesweeper Game with an epic score of {durationS} seconds on a {device} device!

      {isAuthenticated ? <div>Save your score as "{username}"!</div> : <div className={classes.centeredContainer}><Button onClick={onLogin}>Login to submit score</Button></div>}
    </DialogContent>

    <DialogActions>
      <Button disabled={!isAuthenticated || !Boolean(username) || isSubmitting} color="primary" onClick={onSubmit}>
        Submit
      </Button>
      <Button autoFocus onClick={onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>)
}