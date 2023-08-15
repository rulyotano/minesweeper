import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { apiClient } from "../../../../../common";

export default function () {
  const [ranking, setRanking] = React.useState([]);
  React.useEffect(() => {
    apiClient.get("ranking").then(result => {
      console.log(result.data);
    });
  }, [])

  return (<Dialog onClose={() => { alert("closed") }} aria-labelledby="Ranking" open={true}>
    <DialogTitle id="customized-dialog-title" onClose={() => alert("close")}>
      Ranking
    </DialogTitle>
    <DialogContent dividers>

    </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={() => {}} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>)
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});