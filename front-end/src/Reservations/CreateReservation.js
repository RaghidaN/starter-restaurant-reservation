import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function CreateReservation() {
  //reservation template
  const emptyReservation = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [reservation, setReservation] = useState(emptyReservation);
  const [newReservationsError, setNewReservationsError] = useState(null);
  const history = useHistory();

  //controlling the component
  const handleChange = (event) => {
    setReservation({
      ...reservation,
      [event.target.name]:
        event.target.type === "number"
          ? parseInt(event.target.value)
          : event.target.value,
    });
  };

  //creating the reservation after clicking submit
  const handleSubmit = (event) => {
    event.preventDefault();
    createNewReservation(reservation);
  };

  //sending the api call and clearing the form
  function createNewReservation(reservation) {
    const abortController = new AbortController();
    setNewReservationsError(null);
    createReservation(reservation, abortController.signal)
      .then(() =>
        history.push(`/reservations?date=${reservation.reservation_date}`)
      )
      .then(() => setReservation(emptyReservation))
      .catch(setNewReservationsError);
    return () => abortController.abort();
  }

  return (
    <div className="card-main col-md-8 p-4">
      <h1>Create New Reservation</h1>
      <ReservationForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        reservation={reservation}
        history={history}
      />
      <ErrorAlert error={newReservationsError} />
    </div>
  );
}

export default CreateReservation;