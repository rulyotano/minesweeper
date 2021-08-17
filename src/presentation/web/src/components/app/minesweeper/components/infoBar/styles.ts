import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";

export default (theme: Theme) =>
  createStyles({
    infoBarContainer: {
      display: "flex",
      justifyContent: "space-between",
      margin: theme.spacing(1)
    },
    lineCentered: {
      display: "flex",
      alignItems: "center"
    },
    timeTextContainer: {
      width: theme.spacing(3),
      display: "inline-block",
      textAlign: "right"
    },
    minesLeftContainer: {
      width: theme.spacing(6)
    }
  });
