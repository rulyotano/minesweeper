import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton, Link } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
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
