import * as React from "react";
import { Route, Switch, Redirect } from "react-router";
import Layout from "./common/layout/Layout";
import Minesweeper from "./app/minesweeper";

export default () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={Minesweeper} />
      <Route>
        <Redirect to="/"/>
      </Route>
    </Switch>
  </Layout>
);
