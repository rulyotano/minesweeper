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
import apiClient from "../../../../../common/clients/apiClient";

export default () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const gameLevel = useSelector(getGameLevel);
  const startTime = useSelector(getStartTime) || new Date();
  const finishTime = useSelector(getFinishTime) || new Date();
  const isGameWon = useSelector(getIsGameWon);
  const username = useSelector(getUsername);
  const dispatch = useDispatch();

  const onClose = () => setIsOpen(false);

  React.useEffect(() => {
    // setIsOpen(isGameWon);
    setIsOpen(true);
  }, [isGameWon])

  const onTextChange = React.useCallback((newUsername: string) => {
    dispatch(setUsername(newUsername));
  }, [dispatch])

  const onSubmit = React.useCallback(() => {
    apiClient.put("ranking", {  })
  }, [])

  return (<Dialog fullWidth={true} maxWidth="sm" onClose={onClose} aria-labelledby="Ranking" open={isOpen}>
    <DialogTitle id="submit-ranking-dialog-title" onClose={onClose}>
      You won a price at level "{gameLevel.name}""
    </DialogTitle>
    
    <DialogContent dividers>
      Congrats!!! <span role="img" aria-label="win">😎</span>
      You won the Minesweeper Game with an epic record of {moment.duration(finishTime!.valueOf() - startTime!.valueOf()).asSeconds()} seconds 
      Submit to the global ranking?

      <TextField
        autoFocus
        margin="dense"
        id="username"
        label="Your username"
        type="text"
        fullWidth
        defaultValue={username}
        onChange={e => onTextChange(e.target.value)}
      />
    </DialogContent>

    <DialogActions>
      <Button disabled={!username} color="primary" onClick={onClose}>
        Submit
      </Button>
      <Button autoFocus onClick={onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>)
}