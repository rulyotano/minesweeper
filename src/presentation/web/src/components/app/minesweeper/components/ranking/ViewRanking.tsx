import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { Theme } from "@material-ui/core/styles/createTheme";
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
import { useSelector } from "react-redux";
import { getGameLevel } from "../../_duck/selectors";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Skeleton from "@material-ui/lab/Skeleton";
import moment from "moment";

interface RankingResult {
  timeInMs: number,
  userName: string
}

export default function () {
  const [ranking, setRanking] = React.useState<Array<RankingResult>>([]);
  const [loading, setLoading] = React.useState(true);

  var gameLevel = useSelector(getGameLevel);
  React.useEffect(() => {
    apiClient.get(`ranking?gameSize=${gameLevel}`).then(result => {
      setRanking(result.data as Array<RankingResult>);
      setLoading(false);
    });
  }, [gameLevel])

  return (<Dialog fullWidth={true} maxWidth="sm" onClose={() => { alert("closed") }} aria-labelledby="Ranking" open={true}>
    <DialogTitle id="customized-dialog-title" onClose={() => alert("close")}>
      Ranking
    </DialogTitle>
    <DialogContent dividers>
      <Table aria-label="ranking">
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? <Loading /> :
            ranking.map((row, index) => (
              <TableRow key={row.userName + row.timeInMs + index}>
                <TableCell component="th" scope="row">{index + 1}</TableCell>
                <TableCell>{row.userName}</TableCell>
                <TableCell align="right">{moment.duration(row.timeInMs).asSeconds()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={() => { }} color="primary">
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

const Loading = () => {
  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row"><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell align="right"><Skeleton /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row"><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell align="right"><Skeleton /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row"><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell align="right"><Skeleton /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row"><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell align="right"><Skeleton /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row"><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell align="right"><Skeleton /></TableCell>
      </TableRow>
    </>)
}