import React from "react";
import { useHistory } from "react-router";
import { unreserveTable } from "../utils/api";

function TableCard({ table }) {
  let history = useHistory();
  const { capacity, table_name, reservation_id } = table;

  function handleFinishButton() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      unreserveTable(table.table_id).then(() => history.push("/"));
    }
  }

  const finishButton = (
    <button
      type="button"
      className="btn btn-success m-1"
      data-table-id-finish={table.table_id}
      onClick={handleFinishButton}
    >
      Finish
    </button>
  );

  return (
    <div className="card text-white m-3 row-md-2 border-0 bg-info">
      <div className="card-body">
        <h5 className="card-title mb-3"> Table: {table_name} </h5>
        <p className="card-text pb-0 mb-0">Capacity: {capacity}</p>
        <p className="card-text" data-table-id-status={table.table_id}>
          Status: {reservation_id ? "Occupied" : "Free"}
        </p>
        {table.reservation_id ? finishButton : null}
      </div>
    </div>
  );
}

export default TableCard;