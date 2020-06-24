import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Header from "../header";
import styles from "./styles";

const useStyles = makeStyles(styles);

const Layout: React.FunctionComponent<LayoutProps> = props => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Header />
        <Container>
          <div>{props.children}</div>
        </Container>
      </div>
    </React.Fragment>
  );
};

interface LayoutProps {}

export default Layout;
