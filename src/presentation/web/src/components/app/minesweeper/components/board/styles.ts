import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";

export default (theme: Theme) =>
  createStyles({
    table: {
      borderStyle: "solid",
      borderWidth: theme.spacing(0.1),
      borderCollapse: "collapse",
      tableLayout: "fixed",
      maxWidth: "max-content",
      minWidth: "max-content",
    },
    tableContainer: {
      width: "100%",
      overflow: "auto"
    }
  });
