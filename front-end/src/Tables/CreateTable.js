import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import TableForm from "./TableForm";
import ErrorAlert from "../layout/ErrorAlert";

function CreateTable() {
  const emptyTable = {
    table_name: "",
    capacity: 0,
  };

  const [newTable, setNewTable] = useState(emptyTable);
  const [newTableError, setNewTableError] = useState(null);
  const history = useHistory();

  const handleChange = (event) => {
    setNewTable({
      ...newTable,
      [event.target.name]:
        event.target.type === "number"
          ? parseInt(event.target.value)
          : event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createNewTable(newTable);
  };

  function createNewTable(newTable) {
    const abortController = new AbortController();
    setNewTableError(null);
    createTable(newTable, abortController.signal)
      .then(() => history.push(`/`))
      .then(() => setNewTable(emptyTable))
      .catch(setNewTableError);
    return () => abortController.abort();
  }

  return (
    <div className="card-main col-md-8 p-4">
      <h1>Create New Table</h1>
      <TableForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        newTable={newTable}
        history={history}
      />
      <ErrorAlert error={newTableError} />
    </div>
  );
}

export default CreateTable;