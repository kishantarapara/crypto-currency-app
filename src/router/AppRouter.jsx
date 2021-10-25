import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import Asstes from "../components/Assets/Assets";
import Details from "../components/Details/Details";
import { history } from "../services/history";

export default function AppRouter() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/assets"></Redirect>
        </Route>
        <Route path="/assets" exact component={Asstes}></Route>
        <Route path="/details" exact component={Details}></Route>
      </Switch>
    </Router>
  );
}
