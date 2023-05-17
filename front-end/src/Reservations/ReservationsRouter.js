import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import useQuery from "../utils/useQuery";
import CreateReservations from "./CreateReservation";
import SeatReservation from "./SeatReservation";
import EditReservation from "./EditReservation";
import DisplayReservation from "./DisplayReservation";

/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */

function ReservationsRouter() {
  const query = useQuery();
  const date = query.get("date");

  return (
    <Switch>
      <Route exact={true} path="/reservations/new">
        <CreateReservations />
      </Route>
      <Route path="/reservations/:reservationId/seat">
        <SeatReservation />
      </Route>
      <Route path="/reservations/:reservationId/edit">
        <EditReservation />
      </Route>
      <Route path="/reservations/:reservationId">
        <DisplayReservation />
      </Route>
      <Route path="/reservations">
        <Dashboard date={date} />
      </Route>
    </Switch>
  );
}

export default ReservationsRouter;