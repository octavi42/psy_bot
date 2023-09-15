import React, { use, useEffect, useState } from "react";
import axios from "axios";
import cuid from "cuid";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

type UploadContentProps = {
  endpoint: string;
  reqElems: { key: string; value: any }[];
  classId: string;
  setSharedData: (newData: any) => void;
};

const UploadComponent = ({ reqElems, endpoint, classId, setSharedData }: UploadContentProps) => {

  const fetchDataAndSetSharedData = async () => {
    await refetchProcessState();
    setSharedData(processState);
  };

  useEffect(() => {
    // This effect will run whenever trackReqElems is updated
    // console.log("trackReqElems updated:", reqElems);
    // console.log("endpoint updated:", endpoint);

    if (reqElems.length > 0 && endpoint !== "") {
      setIsUploadDisabled(false)
      return
    } else {
      setIsUploadDisabled(true)
      return
    }
    
  }, [reqElems]); // Only re-run the effect if trackReqElems changes

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const { data: sessionData } = useSession();
  const { mutate: saveObject } = api.object.createChatObject.useMutation();
  const { mutate: updateTranscription } = api.object.changeTranscription.useMutation();

  const { data: processState, refetch: refetchProcessState } = api.saveState.getState.useQuery();
  // const { mutate: updateProcessState } = api.saveState.changeState.useMutation();

  const [isUploadDisabled, setIsUploadDisabled] = useState(true); // Track loading state
  // const isUploadDisabled = isLoading || !title || !description; // Define the condition for disabling the upload button


  const handleUpload = async () => {
    try {
      setIsLoading(true); // Set loading state to true while waiting for response
  
      const match = cuid() as string;
      const sender = sessionData?.user.id as string;
  
      // Construct the request data object with match and sender
      const requestData: { [key: string]: any } = {
        classId: classId,
        endpoint: endpoint,
        match: match,
        sender: sender,
        userId: sessionData?.user.id,
        title: title,
      };
  
      // Merge reqElems into requestData
      for (const { key, value } of Object.values(reqElems)) {
        requestData[key] = value;
      }
  
      // Send the data to your server with the AbortController signal
      axios({
        method: "post",
        url: "/api/embed/create",
        data: requestData,
        headers: { "Content-Type": "application/json" },
      })
      .finally(() => {
        console.log("finnaly");
        fetchDataAndSetSharedData()
        console.log("Process State:", processState);
        setIsLoading(false);
      })
      .then(() => {
        console.log("then");
        fetchDataAndSetSharedData()
        console.log("Process State:", processState);
        setIsLoading(false);
      })
      .catch(() => {
        console.log("catch");
        fetchDataAndSetSharedData()
        console.log("Process State:", processState);
        setIsLoading(false);
      });
      
        

      // Set the process state to "saved" and update shared data with the response
      // updateProcessState({ state: "saved", message: "Success!" });
      
  
       // Set loading state back to false after response
    } catch (error) {
      console.error("Upload failed:", error);
  
      // Handle errors and set the process state and shared data accordingly
      // updateProcessState({ state: "saved", message: `error: ${error}` });
      // fetchDataAndSetSharedData()
  
      setIsLoading(false); // Make sure to set the loading state back to false in case of an error
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
          disabled={isUploadDisabled} // Set the disabled attribute based on the condition
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
