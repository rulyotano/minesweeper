import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { darken } from "@material-ui/core/styles/colorManipulator";
import createStyles from "@material-ui/core/styles/createStyles";
import { TableCellProps } from "./TableCell";
import { CellStatus } from "../../helpers/cellHelper";

export default (theme: Theme) =>
  createStyles({
    cell: {
      color: (props: TableCellProps) => getTextColorFromCell(theme, props),
      backgroundColor: (props: TableCellProps) => getBackgroundColorFromCell(theme, props),
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

const getTextColorFromCell = (theme: Theme, props: TableCellProps) => {
  if (props.cell.Status === CellStatus.DiscoveredAndNumber) {
    switch (props.cell.MinesAround) {
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
  } else if (props.cell.Status === CellStatus.ExploitedMine) {
    return theme.palette.error.dark;
  }
  return theme.palette.text.primary;
};

const getBackgroundColorFromCell = (theme: Theme, props: TableCellProps) => {
  const discoveredBackgroundColor = darken(theme.palette.background.default, 0.2);
  if (
    props.cell.Status === CellStatus.DiscoveredAndEmpty ||
    props.cell.Status === CellStatus.DiscoveredAndNumber
  )
    return discoveredBackgroundColor;

  if (
    props.cell.Status === CellStatus.ExploitedMine ||
    props.cell.Status === CellStatus.MarkedAsMineButEmpty
  )
    return discoveredBackgroundColor;

  return theme.palette.background.default;
};
