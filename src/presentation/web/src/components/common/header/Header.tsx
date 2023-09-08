import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import styles from "./styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import ViewRanking from "../../app/minesweeper/components/ranking/ViewRanking";
import RankingIcon from "../icons/RankingIcon";
import SizeSelector from "../../app/minesweeper/components/SizeSelector";

const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();
  const [isViewRankingOpen, setIsViewRankingOpen] = React.useState(false);

  return (
    <>
      <AppBar position="static" color="transparent">
        <Toolbar className={classes.bar}>
          <Button onClick={() => setIsViewRankingOpen(true)}><RankingIcon />&nbsp;Ranking</Button>
          <div className={classes.emptySpace}></div>
          <SizeSelector />
          <Login />
        </Toolbar>
      </AppBar>
      
      <ViewRanking isOpen={isViewRankingOpen} onClose={() => setIsViewRankingOpen(false)}/>
    </>
  );
};

const Login = () => {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout
  } = useAuth0();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogin = React.useCallback(() => {
    loginWithRedirect({});
  }, [loginWithRedirect]);

  const onLogout = React.useCallback(() => {
    logout(
      {
        logoutParams: {
          returnTo: window.location.origin,
        }
      }
    );
  }, [logout]);

  if (!isAuthenticated) return (<Button className={classes.loginButton} color="inherit" onClick={onLogin}>Login</Button>)

  return (
    <div>
      {user?.nickname}
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {user?.picture ? <Avatar alt="Profile Picture" src={user.picture} /> : <AccountCircle />}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
