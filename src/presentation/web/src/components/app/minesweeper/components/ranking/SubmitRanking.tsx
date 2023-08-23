import React from "react";
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "./DialogTitle"
import { useDispatch, useSelector } from "react-redux";
import { getFinishTime, getGameLevel, getIsGameWon, getStartTime, getUsername } from "../../_duck/selectors";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import { setUsername } from "../../_duck/actions";
import { apiClient, getDeviceType } from "../../../../../common";

export default () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [localUsername, setLocalUsername] = React.useState<string|null>(null);
  const gameLevel = useSelector(getGameLevel);
  const startTime = useSelector(getStartTime) || new Date();
  const finishTime = useSelector(getFinishTime) || new Date();
  const isGameWon = useSelector(getIsGameWon);
  const username = useSelector(getUsername);
  const dispatch = useDispatch();

  const onClose = () => setIsOpen(false);
  const duration = React.useMemo(() => moment.duration(finishTime!.valueOf() - startTime!.valueOf()), [
    startTime, finishTime
  ]);
  const device = React.useMemo(() => getDeviceType(), []);

  React.useEffect(() => {
    setIsOpen(isGameWon);
    setLocalUsername(username);
  }, [isGameWon, username])

  const onTextChange = React.useCallback((newUsername: string) => {
    setLocalUsername(newUsername);
  }, [])

  const onSubmit = React.useCallback(() => {
    dispatch(setUsername(localUsername));
    setIsSubmitting(true);
    apiClient.put("ranking", { 
      timeInMs: duration.asMilliseconds(),
      username: localUsername,
      gameSize: gameLevel.name,
      device: device
    })
      .then(() => {
        setIsOpen(false);
      })
      .finally(() => setIsSubmitting(false));
  }, [duration, localUsername, gameLevel.name, device, dispatch])

  return (<Dialog fullWidth={true} maxWidth="sm" onClose={onClose} aria-labelledby="Ranking" open={isOpen}>
    <DialogTitle id="submit-ranking-dialog-title" onClose={onClose}>
      You beat Minesweeper at level "{gameLevel.name}" on a "{device}" device
    </DialogTitle>
    
    <DialogContent dividers>
      Congrats!!! <span role="img" aria-label="win">😎</span>
      You won the Minesweeper Game with an epic record of {duration.asSeconds()} seconds on a {device} device!
      Submit to the global ranking?

      <TextField
        autoFocus
        margin="dense"
        id="username"
        label="Your username"
        type="text"
        fullWidth
        defaultValue={localUsername}
        onChange={e => onTextChange(e.target.value)}
      />
    </DialogContent>

    <DialogActions>
      <Button disabled={!localUsername || isSubmitting} color="primary" onClick={onSubmit}>
        Submit
      </Button>
      <Button autoFocus onClick={onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>)
}