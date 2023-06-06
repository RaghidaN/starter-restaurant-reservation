/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const dateFormatted = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const timeFormatted = /[0-9]{2}:[0-9]{2}/;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "people",
  "reservation_date",
  "reservation_time",
];

const validStatuses = ["booked", "cancelled", "finished", "seated"];

/**
 * Create handler
 */
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: "requires request data",
    });
  }

  validProperties.forEach((property) => {
    if (!data[property]) {
      return next({
        status: 400,
        message: `requires ${property}`,
      });
    }

    if (property === "people" && !Number.isInteger(data.people)) {
      return next({
        status: 400,
        message: `requires ${property} to be a number`,
      });
    }

    if (
      property === "reservation_date" &&
      !dateFormatted.test(data.reservation_date)
    ) {
      return next({
        status: 400,
        message: `requires ${property} to be properly formatted as YYYY-MM-DD`,
      });
    }

    if (
      property === "reservation_time" &&
      !timeFormatted.test(data.reservation_time)
    ) {
      return next({
        status: 400,
        message: `requires ${property} to be properly formatted as HH:MM`,
      });
    }
  });

  next();
}

function isBooked(req, res, next) {
  const { data } = req.body;
  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message:
        "A new reservation cannot be created with a status of seated or finished",
    });
  }
  next();
}

function isValidDay(req, res, next) {
  const { data } = req.body;
  const reservationDate = new Date(
    `${data.reservation_date} ${data.reservation_time}`
  );
  let day = days[reservationDate.getDay()];
  let time = data.reservation_time;
  if (reservationDate < new Date() && day === "Tuesday") {
    return next({
      status: 400,
      message:
        "Reservations can only be created on a future date, excluding Tuesdays",
    });
  }
  if (reservationDate < new Date()) {
    return next({
      status: 400,
      message: "Reservations can only be created on a future date",
    });
  }
  if (day === "Tuesday") {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesdays",
    });
  }
  if (time <= "10:30" || time >= "21:30") {
    return next({
      status: 400,
      message: "Reservations can only be made from 10:30AM - 9:30PM.",
    });
  }
  next();
}


async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations;
  if (date) {
    reservations = await service.listByDate(date);
  } else if (mobile_number) {
    reservations = await service.listByNumber(mobile_number);
  }

  res.json({ data: reservations });
}

function notFinished(req, res, next) {
  const { reservation_id } = req.params;
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({
      status: 400,
      message: `Reservation ${reservation_id} is already finished`,
    });
  }
  next();
}

function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id ? reservation_id : ""} Not Found`,
  });
}

async function update(req, res, next) {
  const updated = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  service
    .update(updated)
    .then((data) => res.json({ data }))
    .catch(next);
}

async function updateStatus(req, res, next) {
  const updated = {
    ...res.locals.reservation,
    status: res.locals.status,
  };
  service
    .update(updated)
    .then((data) => res.json({ data }))
    .catch(next);
}

function validStatus(req, res, next) {
  const { status } = req.body.data;
  if (validStatuses.includes(status)) {
    res.locals.status = status;
    next();
  } else {
    next({
      status: 400,
      message:
        "Status unknown! Status must be set to 'booked', 'seated', or 'finished'",
    });
  }
}

function validatePhoneNumber(input_str) {
  var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  return re.test(input_str);
}


function validMobileNumber(req, res, next) {
  const mobileNumber = req.body.data.mobile_number;
  
  if (validatePhoneNumber(mobileNumber)) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Requires valid mobile number.`
    });
  }
  
}


module.exports = {
  create: [
    hasValidProperties,
    isValidDay,
    isBooked,
    validMobileNumber,
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidProperties,
    isValidDay,
    validMobileNumber,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    notFinished,
    asyncErrorBoundary(updateStatus),
  ],
};
