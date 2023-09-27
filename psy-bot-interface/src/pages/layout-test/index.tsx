import React, { useState, useEffect } from "react";
import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"
import { api } from "~/utils/api";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}

export default function DemoPage() {

  const { data: users, refetch: refetchUsers, isFetching: loading } = api.users.getAll.useQuery();



  return (
    <div className="container mx-auto py-10">
      {/* render datatable if user exists */}
      {loading ? (
        <div>Loading...</div>
        ) : (
          <>
            <DataTable columns={columns} data={users} />
            <p>{users[0].name}</p>
          </>
      )}
    </div>
  );
}
