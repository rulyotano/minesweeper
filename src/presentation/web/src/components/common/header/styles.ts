import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

export default (theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    noHeader: {
      height: theme.spacing(11),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }
  });
