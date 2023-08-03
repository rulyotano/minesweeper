import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
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
          <>{props.children}</>
        </Container>
      </div>
    </React.Fragment>
  );
};

interface LayoutProps {}

export default Layout;
