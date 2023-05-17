import React from "react";
import TableCard from "./TableCard";

function ListTables({ tables }) {
  let tablesList = tables.map((table) => (
    <TableCard key={table.table_id} table={table} />
  ));

  return <div>{tablesList}</div>;
}

export default ListTables;