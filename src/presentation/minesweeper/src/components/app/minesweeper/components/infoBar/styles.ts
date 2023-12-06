import { Theme } from "@material-ui/core/styles/createTheme";
import createStyles from "@material-ui/core/styles/createStyles";

export default (theme: Theme) =>
  createStyles({
    infoBarContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: theme.spacing(1),
      height: "64px"
    },
    lineCentered: {
      display: "flex",
      alignItems: "center",
      width: theme.spacing(16)
    },
    timeTextContainer: {
      width: theme.spacing(3),
      display: "inline-block",
      textAlign: "right"
    },
    minesLeftContainer: {
      width: theme.spacing(16),
    }
  });
