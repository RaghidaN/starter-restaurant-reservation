import React from "react";
import ReservationCard from "./ReservationCard";

function ListReservations({ reservations }) {
  let reservationsList = reservations.map((reservation) => (
    <ReservationCard
      reservation={reservation}
      key={reservation.reservation_id}
    />
  ));

  return <div>{reservationsList}</div>;
}

export default ListReservations;