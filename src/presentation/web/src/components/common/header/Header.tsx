import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { NavLink } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import styles from "./styles";

const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Welcome to Mines Sweeper App!
        </Typography>
        <Button color="inherit">
          <Link color="inherit" to="/" component={NavLink}>
            Home
          </Link>
        </Button>
        <Button color="inherit">
          <Link color="inherit" to="/mines-sweeper" component={NavLink}>
            Mines Sweeper
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
};
