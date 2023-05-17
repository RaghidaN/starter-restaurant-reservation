import React from "react";
import { Route, Switch } from "react-router-dom";
import CreateTable from "./CreateTable"

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Tables() {
  return (
    <Switch>
      <Route exact={true} path="/tables/new">
        <CreateTable />
      </Route>
    </Switch>
  );
}

export default Tables;