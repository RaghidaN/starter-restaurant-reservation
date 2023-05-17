import ErrorAlert from "../layout/ErrorAlert";

function PickReservationTable({handleConfirmButton, handleTableChange, tables, tablesError, selectedTableId}) {
  return (
    <fieldset className="card-main col-md-8 p-4 mb-3">
      <h3>Select Table</h3>
      <h6 className="pb-2">table name - capacity</h6>
      <div>
        <select
          id="table"
          name="table_id"
          required={true}
          onChange={handleTableChange}
          value={selectedTableId}
          className="form-select"
          multiple
          aria-label="size 5 select example"
        >
          {tables.map((table) => (
            <option value={table.table_id} key={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
        <br />
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button
            type="submit"
            className="btn btn-success m-1"
            onClick={handleConfirmButton}
          >
            Confirm
          </button>
        </div>
        <ErrorAlert error={tablesError} />
      </div>
    </fieldset>
  );
}

export default PickReservationTable;