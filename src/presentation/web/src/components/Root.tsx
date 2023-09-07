import * as React from "react";
import { Route, Switch, Redirect } from "react-router";
import Layout from "./common/layout/Layout";
import Minesweeper from "./app/minesweeper";

export default () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={() => <Minesweeper key="minesweeper" />} />
      <Route exact path="/game-won" component={() => <Minesweeper key="minesweeper" gameWon />} />
      <Route>
        <Redirect to="/"/>
      </Route>
    </Switch>
  </Layout>
);
