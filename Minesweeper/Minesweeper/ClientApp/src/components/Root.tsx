import * as React from "react";
import { Route } from "react-router";
import Layout from "./common/layout/Layout";
import Landing from "./app/landing";
import Minesweeper from "./app/minesweeper";

export default () => (
  <Layout>
    <Route exact path="/" component={Landing} />
    <Route path="/mines-sweeper" component={Minesweeper} />
  </Layout>
);
