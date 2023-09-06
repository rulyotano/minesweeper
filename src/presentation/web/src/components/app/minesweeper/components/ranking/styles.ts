import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createTheme";

export default (theme: Theme) =>
  createStyles({
    centeredContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3)
    }
  });
