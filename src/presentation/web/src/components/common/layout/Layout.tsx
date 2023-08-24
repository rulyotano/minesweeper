import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import styles from "./styles";
import NoHeader from "../header/NoHeader";
import Footer from "../footer";

const useStyles = makeStyles(styles);

const Layout: React.FunctionComponent<LayoutProps> = props => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.root}>
        <NoHeader />
        <Container>
          <>{props.children}</>
        </Container>
        <Footer />
      </div>
    </React.Fragment>
  );
};

interface LayoutProps {}

export default Layout;
