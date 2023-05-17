import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "./ReservationCard";

function DisplayReservation() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [getReservationError, setGetReservationError] = useState(null);

  //retrieving the reservation from the database
  useEffect(() => {
    const abortController = new AbortController();
    getReservation(reservationId, abortController.signal)
      .then(setReservation)
      .catch(setGetReservationError);
    return () => abortController.abort();
  }, [reservationId]);

  return (
    <div>
      {reservation ? <ReservationCard reservation={reservation} /> : null}
      <ErrorAlert error={getReservationError} />
    </div>
  );
}

export default DisplayReservation;