import React, { use, useEffect, useState } from "react";
import axios from "axios";
import cuid from "cuid";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { SaveState } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { ReloadIcon } from "@radix-ui/react-icons"

type UploadContentProps = {
  endpoint: string;
  reqElems: { key: string; value: any }[];
  classId: string;
  setSharedData: (newData: any) => void;
};

const UploadComponent = ({ reqElems, endpoint, classId, setSharedData }: UploadContentProps) => {

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
  const { mutate: createObject } = api.object.createObject.useMutation();
  const { mutate: updateTranscription } = api.object.changeTranscription.useMutation();
  // const { mutate: updateState } = api.saveState.changeState.useMutation();

  const { data: processState, refetch: refetchProcessState } = api.saveState.getState.useQuery();
  const { mutate: updateProcessState } = api.saveState.changeState.useMutation();

  const [isUploadDisabled, setIsUploadDisabled] = useState(true); // Track loading state
  // const isUploadDisabled = isLoading || !title || !description; // Define the condition for disabling the upload button



  function firstFunction(_callback: () => void){
    // do some asynchronous work
    // and when the asynchronous stuff is complete
    setTimeout(function() {
      updateProcessState({ state: "saving", message: "Success!" });
      _callback();
    }, 0);
  }


  const handleUpload = async () => {
    try {
      setIsLoading(true); // Set loading state to true while waiting for response

      firstFunction(function() {
        setSharedData(true)
      });
  
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
        description: description? description : "",
      };
  
      // Merge reqElems into requestData
      for (const { key, value } of Object.values(reqElems)) {
        requestData[key] = value;
      }

      // const input = {
      //   id: "123",
      //   title: "Sample Object",
      //   description: "A sample object description",
      //   type: "Sample Type",
      //   actualObject: {
      //     attr1: "Value1",
      //     attr2: "Value2",
      //     attr3: "Value3",
      //     // Additional attributes with unknown names and values
      //   },
      // };

      // createObject(input)
  
      // Send the data to your server with the AbortController signal
      axios({
        method: "post",
        url: "/api/embed/create",
        data: requestData,
        headers: { "Content-Type": "application/json" },
      })
      .finally(() => {
        console.log("finnaly");
        setSharedData(false)
        setIsLoading(false);
      })
      .then(() => {
        console.log("then");
        setSharedData(false)
        setIsLoading(false);
      })
      .catch(() => {
        console.log("catch");
        setSharedData(false)
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
    <div className="grid relative max-h-full w-1/4 place-items-center">
      <div className="grid h-4/5 w-full rounded-3xl content-around place-items-center">
        {/* <div className="w-full h-full left-0 top-0 bg-orange-50 rounded-[31px]" /> */}

        {/* <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="Rectangle14 p-5 h-10 top-10 absolute bg-orange-50 rounded-[30px] border border-slate-400 left-0 right-0 mx-5"
        /> */}

        <Input 
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-xl border border-slate-400 hover:bg-slate-100 transition-colors"
        />


        <Textarea 
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-96 rounded-xl border border-slate-400 resize-none hover:bg-slate-100 transition-colors"
          />


        {/* <Button disabled={true} className="hover:bg-gray-300 rounded-xl w-1/2 grid place-items-center">
          {true ? (
            <div className="flex">
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Uploading
            </div>
          ) : (
            <>Upload</>
          )}
        </Button> */}


        {isLoading ? (
          <Button disabled={isUploadDisabled} className="">
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Uploading
          </Button>
        ) : (
          <Button onClick={handleUpload} variant="ghost" className="hover:bg-gray-300 rounded-xl w-10/12 grid place-items-center">
            Upload
          </Button>
        )}

        {/* <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-5 h-2/3 bg-orange-50 rounded-[30px] border border-slate-400 left-0 right-0 mx-4 top-1/2 transform -translate-y-1/2"
        />

        <button
          className="h-16 bottom-10 bg-blue-950 rounded-[30px] left-0 right-0 mx-5 text-white"
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
      </button> */}
      </div>
    </div>
  );
};

export default UploadComponent;
