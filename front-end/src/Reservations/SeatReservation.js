import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, seatReservation } from "../utils/api";
import PickReservationTable from "./PickReservationTable";

function SeatReservation() {
  const { reservationId } = useParams();
  const history = useHistory();
  const [stateForm, setStateForm] = useState({
    tables: [],
    selectedTableId: "",
    tablesError: null,
  });

  const { tables, selectedTableId, tablesError } = stateForm;

  useEffect(loadTables, []);

  // sending an api call to retrieve the tables information
  function loadTables() {
    const abortController = new AbortController();
    setStateForm((currenState) => ({ ...currenState, tablesError: null }));
    listTables(abortController.signal)
      .then((response) =>
        setStateForm((currenState) => ({ ...currenState, tables: response }))
      )
      .catch((error) =>
        setStateForm((currenState) => ({ ...currenState, tablesError: error }))
      );
    return () => abortController.abort();
  }

  // controlling the component
  const handleTableChange = (event) => {
    setStateForm((currenState) => ({
      ...currenState,
      selectedTableId: event.target.value,
    }));
  };

  // sending an api call to add the reservation id to the selected table
  const handleConfirmButton = (event) => {
    event.preventDefault();
    seatReservation(selectedTableId, reservationId)
      .then(() => history.push("/"))
      .catch((error) =>
        setStateForm((currenState) => ({ ...currenState, tablesError: error }))
      );
  };

  const props = {
    handleConfirmButton,
    handleTableChange,
    tables,
    tablesError
  }

  return <PickReservationTable {...props} />
    
}

export default SeatReservation;