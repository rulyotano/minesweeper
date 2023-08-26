import React from "react";
import Dialog from "@material-ui/core/Dialog";
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
import DialogTitle from "./DialogTitle";

interface RankingResult {
  timeInMs: number,
  userName: string
}

interface ViewRankingProps {
  isOpen: boolean,
  onClose: () => void
}

export default function (props: ViewRankingProps) {
  const { isOpen, onClose } = props;
  const [ranking, setRanking] = React.useState<Array<RankingResult>>([]);
  const [loading, setLoading] = React.useState(true);

  const gameLevel = useSelector(getGameLevel);
  React.useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    apiClient.get(`ranking?gameSize=${gameLevel.name}&limit=20`).then(result => {
      setRanking(result.data as Array<RankingResult>);
      setLoading(false);
    }, () => {
      setLoading(false);
    });
  }, [gameLevel, isOpen])

  React.useEffect(() => {
    setTimeout(() => document.body.style.overflow = isOpen ? "hidden" : "unset", 1);
  }, [isOpen]);

  return (<Dialog fullWidth={true} maxWidth="sm" onClose={onClose} aria-labelledby="Ranking View" open={isOpen}>
    <DialogTitle id="view-ranking-dialog-title" onClose={onClose}>
      Top 20 - Ranking {gameLevel.name}
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
            ranking.length === 0 ? <NoResult /> :
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
      <Button autoFocus onClick={onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>)
}

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
    </>);
}

const NoResult = () => (
  <TableRow>
    <TableCell align="center" scope="row" colSpan={3}>No submitted results.</TableCell>
  </TableRow>
);