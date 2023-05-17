const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const validProperties = ["capacity", "table_name"];

async function clearTable(req, res, next) {
  const table = res.locals.table;
  const clearedTable = {
    ...table,
    reservation_id: null,
  };
  reservationService.updateStatus(table.reservation_id, "finished");
  service
    .update(clearedTable)
    .then((data) => res.json({ data }))
    .catch(next);
}

async function create(req, res) {
  const { data } = req.body;
  const newTable = await service.create(data);
  res.status(201).json({ data: newTable });
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

    if (
      (property === "capacity" && data.capacity < 1) ||
      (property === "capacity" && !Number.isInteger(data.capacity))
    ) {
      return next({
        status: 400,
        message: `${property} required to be a number of 1 or greater`,
      });
    }

    if (property === "table_name" && data.table_name.length <= 1) {
      return next({
        status: 400,
        message: `${property} required to be at least 2 characters in length`,
      });
    }
  });
  next();
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

function notSeated(req, res, next) {
  const { reservation_id, status } = res.locals.reservation;
  if (status === "seated") {
    return next({
      status: 400,
      message: `Reservation ${reservation_id} has already been seated!`,
    });
  }
  next();
}

function read(req, res) {
  res.json({ data: res.locals.table });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} Not Found`,
  });
}

async function seatTable(req, res, next) {
  const reservation_id = res.locals.reservation.reservation_id;
  const table = res.locals.table;
  const updatedTable = {
    ...table,
    reservation_id: reservation_id,
  };
  reservationService.updateStatus(reservation_id, "seated");
  service
    .update(updatedTable)
    .then((data) => res.json({ data }))
    .catch(next);
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${table_id ? table_id : ""} Not Found`,
  });
}

function tableOccupied(req, res, next) {
  const table = res.locals.table;
  if (table.reservation_id === null) {
    return next({
      status: 400,
      message: "Table is not occupied!",
    });
  }
  next();
}

async function validRequest(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: `requires request data`,
    });
  }
  if (!data.reservation_id) {
    return next({
      status: 400,
      message: `Requires reservation_id property`,
    });
  }
  next();
}

function validTable(req, res, next) {
  const reservation = res.locals.reservation;
  const table = res.locals.table;
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message:
        "Table does not have sufficient capacity to handle this reservation",
    });
  }
  if (table.reservation_id !== null) {
    return next({
      status: 400,
      message: "Table is occupied!",
    });
  }
  next();
}

module.exports = {
  clearTable: [
    asyncErrorBoundary(tableExists),
    tableOccupied,
    asyncErrorBoundary(clearTable),
  ],
  create: [hasValidProperties, asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(tableExists), read],
  update: [
    validRequest,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    validTable,
    notSeated,
    asyncErrorBoundary(seatTable),
  ],
};