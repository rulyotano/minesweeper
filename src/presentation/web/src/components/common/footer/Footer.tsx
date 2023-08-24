import React from "react";
import GitHubIcon from "@material-ui/icons/GitHub";
import styles from "./styles";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(styles);

const Footer: React.FunctionComponent<FooterProps> = (props: FooterProps) => {
  const classes = useStyles();

  return <div className={classes.footer}>
    <div>Made with&nbsp;<span role="img" aria-label="love">❤️</span>&nbsp;by&nbsp;<a href="https://rulyotano.com" target="_blank" rel="noopener noreferrer">rulyotano</a></div>
    <div><GitHubIcon className={classes.icon}/> Can find &nbsp;<a href="https://github.com/rulyotano/minesweeper" target="_blank" rel="noopener noreferrer">the Github repo here!</a></div>
  </div>;
};

interface FooterProps {
  someProp?: string;
}

export default React.memo(Footer);
