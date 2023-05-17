import React from "react";

function TableForm({ handleChange, handleSubmit, newTable, history }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="table_name" className="form-label">
          Table Name
        </label>
        <input
          className="form-control"
          id="table_name"
          name="table_name"
          required
          onChange={handleChange}
          value={newTable.first_name}
          placeholder="Insert table name here"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="capacity" className="form-label">
          Capacity
        </label>
        <input
          className="form-control"
          id="capacity"
          name="capacity"
          type="number"
          required
          onChange={handleChange}
          value={newTable.capacity}
        />
      </div>
      <div className="row justify-content-end">
        <div className="col col-auto">
          <button type="submit" className="btn btn-primary m-1">
            Submit
          </button>
          <button
            className="btn btn-secondary m-1"
            onClick={() => history.go(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

export default TableForm;