import { Theme } from "@material-ui/core/styles/createTheme";
import { darken } from "@material-ui/core/styles/colorManipulator";
import createStyles from "@material-ui/core/styles/createStyles";
import { Cell, CellStatus } from "../../helpers/cellHelper";

export default (theme: Theme) =>
  createStyles({
    cell: {
      color: (cell: Cell) => getTextColorFromCell(theme, cell),
      backgroundColor: (cell: Cell) => getBackgroundColorFromCell(theme, cell),
      height: theme.spacing(5),
      width: theme.spacing(5),
      borderStyle: "solid",
      borderWidth: theme.spacing(0.1),
      borderColor: theme.palette.text.primary,
      WebkitTouchCallout: "none",
      WebkitUserSelect: "none",
      KhtmlUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
      WebkitTapHighlightColor: "rgba(0,0,0,0)"
    },
    cellContent: {      
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  });

const getTextColorFromCell = (theme: Theme, cell: Cell) => {
  if (cell.Status === CellStatus.DiscoveredAndNumber) {
    switch (cell.MinesAround) {
      case 1:
        return theme.palette.primary.main;
      case 2:
        return theme.palette.success.main;
      case 3:
        return theme.palette.error.main;
      case 4:
        return theme.palette.primary.dark;
      case 5:
        return theme.palette.error.dark;
      case 6:
        return theme.palette.success.light;
      case 7:
        return theme.palette.text.primary;
      case 8:
        return theme.palette.text.disabled;
      default:
        break;
    }
  } else if (cell.Status === CellStatus.ExploitedMine) {
    return theme.palette.error.dark;
  }
  return theme.palette.text.primary;
};

const getBackgroundColorFromCell = (theme: Theme, cell: Cell) => {
  const discoveredBackgroundColor = darken(theme.palette.background.default, 0.2);
  if (
    cell.Status === CellStatus.DiscoveredAndEmpty ||
    cell.Status === CellStatus.DiscoveredAndNumber
  )
    return discoveredBackgroundColor;

  if (
    cell.Status === CellStatus.ExploitedMine ||
    cell.Status === CellStatus.MarkedAsMineButEmpty
  )
    return discoveredBackgroundColor;

  return theme.palette.background.default;
};

export const wrongFlagIconStyles = (theme: Theme) =>
  createStyles({
    wrongFlag: {
      position: "relative",
      height: "24px",
      width: "24px",
      "& > svg": {
        position: "absolute",
        top: "0",
        left: "0"
      },
      "& > #cross": {
        color: theme.palette.error.dark
      }
    }
  });