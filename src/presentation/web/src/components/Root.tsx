import * as React from "react";
import { Route, Switch } from "react-router";
import Layout from "./common/layout/Layout";
import Landing from "./app/landing";
import Minesweeper from "./app/minesweeper";

export default () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route path="/mines-sweeper" component={Minesweeper} />
    </Switch>
  </Layout>
);
