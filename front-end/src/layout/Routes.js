import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationsRouter from "../Reservations/ReservationsRouter";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Tables from "../Tables/Tables";
import Search from "../Search/Search";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
        </Route>
      <Route path="/reservations">
        <ReservationsRouter />
      </Route>
      <Route path="/tables">
        <Tables />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;