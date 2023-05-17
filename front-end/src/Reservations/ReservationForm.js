import React from "react";

function ReservationForm({ handleChange, handleSubmit, reservation, history }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="first_name" className="form-label">
          First Name{" "}
        </label>{" "}
        <input
          className="form-control"
          id="first_name"
          name="first_name"
          required
          onChange={handleChange}
          value={reservation.first_name}
          placeholder="Insert first name here"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="last_name" className="form-label">
          Last Name{" "}
        </label>{" "}
        <input
          className="form-control"
          id="last_name"
          name="last_name"
          required
          onChange={handleChange}
          value={reservation.last_name}
          placeholder="Insert last name here"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="mobile_number" className="form-label">
          Mobile number{" "}
        </label>{" "}
        <input
          type="tel"
          //  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          className="form-control"
          id="mobile_number"
          name="mobile_number"
          required
          onChange={handleChange}
          value={reservation.mobile_number}
          placeholder="ex: 000-000-0000"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="reservation_date" className="form-label">
          Reservation date{" "}
        </label>{" "}
        <input
          className="form-control"
          type="date"
          id="reservation_date"
          name="reservation_date"
          // min={todaysDate}
          required
          onChange={handleChange}
          value={reservation.reservation_date}
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="reservation_time" className="form-label">
          Reservation time{" "}
        </label>{" "}
        <input
          type="time"
          // min="10:30"
          // max="21:30"
          className="form-control"
          id="reservation_time"
          name="reservation_time"
          required
          onChange={handleChange}
          value={reservation.reservation_time}
          placeholder="HH:MM"
          pattern="[0-9]{2}:[0-9]{2}"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="people" className="form-label">
          Number of people{" "}
        </label>{" "}
        <input
          type="number"
          className="form-control"
          id="people"
          name="people"
          required
          onChange={handleChange}
          value={reservation.people}
        />{" "}
      </div>{" "}
      <div className="row justify-content-end">
        <div className="col col-auto align-self-end">
          <button
            type="submit"
            className="btn btn-primary m-1"
            onClick={handleSubmit}
          >
            Submit{" "}
          </button>{" "}
          <button
            className="btn btn-secondary m-1"
            onClick={() => history.go(-1)}
          >
            Cancel{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </form>
  );
}

export default ReservationForm;