import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import axios from "axios";
import { SetStateAction, useEffect, useRef, useState } from "react";


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertDialogComponent } from "~/components/Alert";
import DemoPage from "./ObjectListTable/page";
import UploadComponenrts from "./ObjectListTable/page";
import UploadComponents from "./ObjectListTable/page";




const ObjectList = () => {
  const { data: sessionData } = useSession();

  const [filter, setFilter] = useState("All");
  const [user, setUser] = useState("");

  // create a ref to the input element
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const { data: objectData, isFetching: isObjectsLoading, refetch: refetchObject } = api.object.getAll.useQuery({
    filter,
    user,
  });
  const { mutate: deleteObject } = api.object.deleteObject.useMutation();

  // Add state to track description expansion
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

  // Function to toggle description expansion
  const toggleDescriptionExpansion = (itemId: string) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  const handleFilterChange = (newFilter: string, newUser: string) => {
    setFilter(newFilter); // Update the filter state
    setUser(newUser); // Update the user state
  };

  const handleInputChange = () => {
    // Get the value from the input field
    const newUser = inputRef.current?.value || '';

    // Refetch data with the new user
    // You may need to debounce or validate the input before refetching
    // For simplicity, we refetch immediately
    if (newUser.length >= 3 || newUser.length == 0) {
      setUser(newUser);
      // You may need to debounce or validate the input before refetching
      // For simplicity, we refetch immediately
      refetchObject();
    }
  };

  const handleDeleteItem = (itemId: string, type: string) => {
    const match = itemId;
    const sender = sessionData?.user.id as string;

    // Construct the request data object with match and sender
    const requestData: { [key: string]: any } = {
      class: type,
      id: match,
      sender: "null"
    };

    try {
      axios({
        method: "post",
        url: "/api/embed/remove",
        data: requestData,
        headers: { "Content-Type": "application/json" }, // Change to "application/json"
      })
        .then(function () {
          deleteObject(
            {
              id: match,
            },
            {
              onError(error) {
                console.log(error);
              },
            }
          );
        })
        .catch(function (response) {
          console.error(response);
        });

      // Handle success or show a message to the user
      // console.log("Upload successful:", response.data);
    } catch (error) {
      // Handle error or show an error message to the user
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="px-8 relative flex flex-col h-screen" style={{ scrollSnapAlign: "start" }}>
      {/* Top Navigation Bar */}
      {/* <div className="bg-white m-4">
        <div className="flex justify-between items-center space-x-4 mx-4">
          <div className="flex space-x-4">
            <button
                className={`nav-link ${filter === "All" ? "active" : ""}`}
                onClick={() => handleFilterChange("All", user)}
              >
                All
            </button>
            <button
              className={`nav-link ${filter === "Youtube" ? "active" : ""}`}
              onClick={() => handleFilterChange("Youtube", user)}
            >
              Youtube
            </button>
            <button
              className={`nav-link ${filter === "Audio" ? "active" : ""}`}
              onClick={() => handleFilterChange("Audio", user)}
            >
              Audio
            </button>
            <button
              className={`nav-link ${filter === "File" ? "active" : ""}`}
              onClick={() => handleFilterChange("File", user)}
            >
              File
            </button>
            <button
              className={`nav-link ${filter === "Questions" ? "active" : ""}`}
              onClick={() => handleFilterChange("Questions", user)}
            >
              Questions
            </button>
            <button
              className={`nav-link ${filter === "Data" ? "active" : ""}`}
              onClick={() => handleFilterChange("Data", user)}
            >
              Data
            </button>
          </div> */}

          {/* User Input */}
          {/* <div className="flex items-center">
            <input
              type="text"
              placeholder="User"
              className="px-2 py-1 rounded-md border border-gray-400"
              ref={inputRef} // Set the ref to the input field
              onChange={handleInputChange} // Handle user input change
            />
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded-md ml-2"
              onClick={handleInputChange} // Handle user input change
            >
              Search
            </button>
          </div>
        </div>
      </div> */}

      {/* Uploaded Data */}
      {/* <div className="p-4 relative h-full"> */}
        <h2 className="text-xl font-semibold mb-4 pt-8 grow-0">Uploaded Data</h2>
        <UploadComponents />
      </div>
    // </div>
  );
};

export default ObjectList;
