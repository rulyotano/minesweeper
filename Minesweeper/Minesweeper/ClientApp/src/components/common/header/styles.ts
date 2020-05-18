import { Theme, createStyles } from "@material-ui/core/styles";

export default (theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  });
