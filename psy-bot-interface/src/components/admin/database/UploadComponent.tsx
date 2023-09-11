import React, { useEffect, useState } from "react";
import axios from "axios";
import cuid from "cuid";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

type UploadContentProps = {
  inuse: boolean;
  endpoint: string;
  reqElems: { key: string; value: any }[];
};

const UploadComponent = ({ reqElems, endpoint }: UploadContentProps) => {

  useEffect(() => {
    // This effect will run whenever trackReqElems is updated
    // console.log("trackReqElems updated:", reqElems);
    console.log("endpoint updated:", endpoint);
    
  }, [reqElems]); // Only re-run the effect if trackReqElems changes

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const { data: sessionData } = useSession();
  const { mutate: saveObject } = api.object.createChatObject.useMutation();
  const { mutate: updateTranscription } = api.object.changeTranscription.useMutation();

  let abortController: AbortController | undefined; // Declare abortController at the outermost scope

if (typeof window !== "undefined") {
  // Check if 'window' is defined (client-side)
  abortController = new AbortController();

  // Attach an event listener to the beforeunload event
  window.addEventListener("beforeunload", () => {
    // Abort the pending fetch request when the user is navigating away
    if (abortController) {
      abortController.abort();
    }
  });
}

const handleUpload = async () => {
  try {
    setIsLoading(true); // Set loading state to true while waiting for response

    const match = cuid() as string;
    const sender = sessionData?.user.id as string;

    // Construct the request data object with match and sender
    const requestData: { [key: string]: any } = {
      endpoint: endpoint,
      match: match,
      sender: sender,
      userId: sessionData?.user.id,
      title: title,
      description: description,
    };

    // Merge reqElems into requestData
    for (const { key, value } of Object.values(reqElems)) {
      requestData[key] = value;
    }

    console.log("requestData:", requestData);

    if (!abortController) {
      // Create a new AbortController if it's not already defined
      abortController = new AbortController();
    }

    // Send the data to your server with the AbortController signal
    await axios({
      method: "post",
      url: "/api/embed/create",
      data: requestData,
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (response) {
        console.error(response);
      })
      .finally(() => {
        console.log("finally");
        setIsLoading(false); // Set loading state back to false after response
      });

    // Do not reassign abortController to the localAbortController
    // Remove this line: abortController = localAbortController;
  } catch (error) {
    console.error("Upload failed:", error);
    setIsLoading(false); // Make sure to set loading state back to false in case of an error
  }
};


  return (
    <div className="w-1/4">
      <div className="Group1 h-full w-full relative">
        <div className="relative Rectangle w-full h-full left-0 top-0 bg-orange-50 rounded-[31px]" />

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="Rectangle14 p-5 h-10 top-10 absolute bg-orange-50 rounded-[30px] border border-slate-400 left-0 right-0 mx-5"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="Rectangle15 p-5 h-2/3 absolute bg-orange-50 rounded-[30px] border border-slate-400 left-0 right-0 mx-4 top-1/2 transform -translate-y-1/2"
        />

        <button
          className="Rectangle16 h-16 bottom-10 absolute bg-blue-950 rounded-[30px] left-0 right-0 mx-5 text-white"
          onClick={handleUpload}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-blue-500 rounded-full"></div>
              Uploading...
            </div>
          ) : (
            "Upload"
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadComponent;
