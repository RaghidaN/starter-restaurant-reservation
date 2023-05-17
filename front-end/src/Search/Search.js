import React, { useState, useEffect } from "react";
import useQuery from "../utils/useQuery";
import { search } from "../utils/api";
import ListReservations from "../Reservations/ListReservations";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
  const [stateForm, setStateForm] = useState({
    number: "",
    found: "",
    displayResult: false,
    searchError: null,
    loading: false,
  });

  const { number, found, displayResult, searchError, loading } = stateForm;

  let queryNumber = 0;

  const query = useQuery();
  if (query.get("mobile_number")) {
    queryNumber = query.get("mobile_number");
  }

  //load found reservations
  useEffect(() => {
    if (queryNumber) {
      setStateForm((currentState) => ({
        ...currentState,
        number: queryNumber,
      }));
      loadResults(queryNumber);
    }
  }, [queryNumber]);

  const handleChange = (event) => {
    setStateForm((currentState) => ({
      ...currentState,
      number: event.target.value,
      displayResult: false,
    }));
  };

  function loadResults(phoneNumber) {
    const abortController = new AbortController();
    setStateForm((currentState) => ({
      ...currentState,
      loading: true,
    }));
    search(phoneNumber, abortController.signal)
      .then((response) =>
        setStateForm((currentState) => ({
          ...currentState,
          found: response,
          displayResult: true,
          loading: false,
        }))
      )
      .catch((error) =>
        setStateForm((currentState) => ({
          ...currentState,
          searchError: error,
        }))
      );
    return () => abortController.abort();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    loadResults(number);
  };

  const noReservationsFound = (
    <div className="row  justify-content-center ">
      <div className="card-main col-10 p-4 mb-3 justify-content-center text-center">
        <p>No reservations found for this number: {number}</p>
      </div>
    </div>
  );

  const loadingSpinner = (
    <div className="row  justify-content-center ">
      <div className="card-main col-10 p-4 mb-3 justify-content-center">
        <div className="d-flex justify-content-center p-5 m-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="card-main padded col-10 pb-4 mb-3">
            <form className="mx-3" onSubmit={handleSubmit}>
              <h2 className="mb-3">Search</h2>
              <div className="mb-3">
                <input
                  className="form-control"
                  id="mobile_number"
                  name="mobile_number"
                  required
                  onChange={handleChange}
                  value={number}
                  placeholder="Insert phone number"
                />
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="submit" className="btn btn-primary m-1">
                  Search
                </button>
              </div>
            </form>
            <ErrorAlert error={searchError} />
          </div>
        </div>
        {loading ? loadingSpinner : null}
        {displayResult ? (
          found.length ? (
            <div className="row  justify-content-center ">
              <div className="card-main col-10 p-4 mb-3">
                <ListReservations reservations={found} />
              </div>
            </div>
          ) : (
            noReservationsFound
          )
        ) : null}
      </div>
    </>
  );
}

export default Search;