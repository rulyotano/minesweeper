import React from "react";
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "./DialogTitle"
import { useSelector } from "react-redux";
import { getFinishTime, getGameLevel, getIsGameWon, getStartTime } from "../../_duck/selectors";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import moment from "moment";

export default () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const gameLevel = useSelector(getGameLevel);
  const startTime = useSelector(getStartTime) || new Date();
  const finishTime = useSelector(getFinishTime) || new Date();
  const isGameWon = useSelector(getIsGameWon);

  const onClose = () => setIsOpen(false);

  React.useEffect(() => {
    if (isGameWon) setIsOpen(true);
  }, [isGameWon])

  return (<Dialog fullWidth={true} maxWidth="sm" onClose={onClose} aria-labelledby="Ranking" open={isOpen}>
    <DialogTitle id="submit-ranking-dialog-title" onClose={onClose}>
      You won a price at level "{gameLevel.name}""
    </DialogTitle>
    
    <DialogContent dividers>
      Congrats!!! <span role="img" aria-label="win">😎</span>
      You won the Minesweeper Game with an epic record of {moment.duration(finishTime!.valueOf() - startTime!.valueOf()).asSeconds()} seconds 
      Submit to the global ranking?
    </DialogContent>

    <DialogActions>
      <Button autoFocus onClick={onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>)
}