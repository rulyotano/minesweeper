import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Dialog from "@material-ui/core/Dialog"
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogTitle from "./DialogTitle"
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getFinishTime, getGameLevel, getIsGameWon, getStartTime } from "../../_duck/selectors";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { apiClient, getDeviceType } from "../../../../../common";
import { setTimeout } from "timers";
import styles from "./styles";
import { ParamsType } from "./types";
import { SubmitKeyHelper } from "./keys";

const useStyles = makeStyles(styles);

export default () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const classes = useStyles();
  const gameLevel = useSelector(getGameLevel);
  const startTimeMs = SubmitKeyHelper.getDateSecond(useSelector(getStartTime));
  const finishTimeMs = SubmitKeyHelper.getDateSecond(useSelector(getFinishTime), startTimeMs);
  const isGameWon = useSelector(getIsGameWon);
  const history = useHistory();
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const { winKey } = useParams<ParamsType>();
  const isOpen = Boolean(winKey);
  const gameState = React.useMemo(() => isOpen ? SubmitKeyHelper.getGameStateFromKey(winKey) : {
    startedMs: startTimeMs,
    finishedMs: finishTimeMs,
    level: gameLevel
  }, [isOpen, winKey, startTimeMs, finishTimeMs, gameLevel]);

  const onClose = React.useCallback(() => {
    SubmitKeyHelper.removeKey(winKey);
    history.push("/");
  }, [history, winKey]);
  const onOpen = React.useCallback(() => {
    const newKey = SubmitKeyHelper.getKeyFromGameState(gameState);
    history.push(`/game-won/${newKey}`);
  }, [gameState, history]);
  const duration = React.useMemo(() => moment.duration(gameState.finishedMs - gameState.startedMs), [
    gameState.startedMs, gameState.finishedMs
  ]);
  const durationMs = duration.asMilliseconds();
  const device = React.useMemo(() => getDeviceType(), []);

  React.useEffect(() => {
    if (isGameWon && startTimeMs !== finishTimeMs) onOpen();
  }, [isGameWon, startTimeMs, finishTimeMs, onOpen])

  const username = user?.nickname;
  const onSubmit = React.useCallback(() => {
    if (!isAuthenticated) return;
    setIsSubmitting(true);
    apiClient.put("ranking", {
      timeInMs: durationMs,
      username: username,
      gameSize: gameState.level.name,
      device: device
    })
      .then(() => {
        onClose();
      })
      .finally(() => setIsSubmitting(false));
  }, [isAuthenticated, durationMs, username, gameState.level.name, device, onClose])

  const onLogin = React.useCallback(() => {
    loginWithRedirect(
      {
        appState: {
          returnTo: `/game-won/${winKey}`
        }
      });
  }, [winKey, loginWithRedirect]);

  React.useEffect(() => {
    setTimeout(() => document.body.style.overflow = (isOpen ? "hidden" : "unset"), 1);
  }, [isOpen]);

  // React.useEffect(() => {
  //   if (durationMs === 0) onClose();
  // }, [durationMs, onClose])

  return (<Dialog fullWidth={true} maxWidth="sm" onClose={onClose} aria-labelledby="Ranking Submit" open={isOpen}>
    <DialogTitle id="submit-ranking-dialog-title" onClose={onClose}>
      You beat Minesweeper at level "{gameState.level.name}" on a "{device}" device
    </DialogTitle>

    <DialogContent dividers>
      Congrats!!! <span role="img" aria-label="win">😎</span>
      You won the Minesweeper Game with an epic score of {duration.asSeconds()} seconds on a {device} device!

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