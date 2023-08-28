import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import styles from "./styles";

const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  return (
    <Container className={classes.noHeader}>
      <Typography variant="h4"></Typography>
    </Container>
  );
};
