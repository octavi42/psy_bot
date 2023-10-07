import React, { useState, useEffect } from "react";
import { userColumns, chatColumns } from "./columns"
import { DataTable } from "./data-table"
import { api } from "~/utils/api";

// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     // ...
//   ]
// }

type ConversationsTableProps = {
  data: string;
}


export default function ConversationsTable(props: ConversationsTableProps) {

//   const { data: users, refetch: refetchUsers, isFetching: loading } = api.users.getAll.useQuery();

  const { data: chats, isFetching: isFetchingChats } = api.chat.getAll.useQuery();

  const { data: users, isFetching: isFetchingUsets } = api.users.getAll.useQuery();

  const [isDataFetching, setIsDataFetching] = useState(false)

  useEffect(() => {
    setIsDataFetching(isFetchingChats || isFetchingUsets)

    console.log(isDataFetching);
  }, [isFetchingChats, isFetchingUsets])

    

  return (
    <div>
      {/* render datatable if user exists */}
      {isDataFetching ? (
        <div>Loading...</div>
        ) : (
          <>
            <DataTable columns={props.data === "chats" ? chatColumns: userColumns} data={props.data === "chats" ? chats : users} />
          </>
      )}
    </div>
  );
}





// {objectData?.map((data) => (
//     <li
//       key={data.id}
//       className="bg-white p-4 rounded-lg shadow-md hover:bg-blue-100 transition-colors relative group"
//     >
//       {/* Item content */}
//       <div className="flex items-center">
//         <div>
//           <h3 className="text-lg font-semibold">{data.title}</h3>
//           {/* Add CSS for expandable description */}
//           <p
//             className={`text-gray-600 ${
//               expandedDescriptions[data.id] ? "max-h-full overflow-y-auto" : "max-h-16 overflow-hidden"
//             }`}
//           >
//             {data.description}
//           </p>
//           {/* Toggle button for description expansion */}
//           { data.description && data.description.length > 100 && (
//             <button
//               className="text-blue-500 hover:underline"
//               onClick={() => toggleDescriptionExpansion(data.id)}
//             >
//               {expandedDescriptions[data.id] ? "Read Less" : "Read More"}
//             </button>
//           )}
//         </div>
//         {/* Delete button */}
//         {/* <button
//           className="ml-auto p-2 text-red-600 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
//           onClick={() => handleDeleteItem(data.id, data.type)} // Call your delete function here
//         >
//           Delete
//         </button> */}

//         <AlertDialogComponent buttonText="Delete" title="Ești sigur că vrei să ștergi conținutul?" description="Această acțiune nu poate fi anulată. Aceasta va șterge permanent datele din baza de date." buttonContinue="Delete"/>

//       </div>
//     </li>
//   ))}