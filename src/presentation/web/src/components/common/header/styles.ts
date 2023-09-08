import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createTheme";

export default (theme: Theme) =>
  createStyles({
    bar: {
      minHeight: theme.spacing(8)
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    noHeader: {
      height: theme.spacing(8),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    emptySpace: {
      flexGrow: 1
    },
    loginButton: {
    }
  });
