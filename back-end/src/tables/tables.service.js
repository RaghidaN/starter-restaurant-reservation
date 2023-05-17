const knex = require("../db/connection");
const table = "tables";

async function create(newTable) {
  return knex(table)
    .insert(newTable)
    .returning("*")
    .then((created) => created[0]);
}

async function list() {
  return knex(table).select("*").orderBy("table_name");
}

async function read(table_id) {
  return knex(table).select("*").where({ table_id }).first();
}

async function update(updatedTable) {
  return knex(table)
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updated) => updated[0]);
}

module.exports = {
  create,
  list,
  read,
  update,
};