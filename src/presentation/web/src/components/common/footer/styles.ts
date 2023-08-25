import { Theme } from "@material-ui/core/styles/createTheme";
import createStyles from "@material-ui/core/styles/createStyles";

export default (theme: Theme) =>
  createStyles({
    footer: {
      fontSize: theme.spacing(1.5),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      marginTop: theme.spacing(5),
      margin: theme.spacing(3),
      "& a:-webkit-any-link": {
        color: theme.palette.primary.dark
      }
    },
    icon: {
      fontSize: theme.spacing(1.4)
    },
    tech: {
      marginTop: theme.spacing(1),
      "& > img": {
        marginLeft: theme.spacing(1)
      }
    }
  });
