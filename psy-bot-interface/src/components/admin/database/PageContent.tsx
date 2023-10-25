import React, { useEffect, useState } from "react";
import DataBox from "../DataBox";
import { dataBoxConfigurations } from "../DataBoxes";
import { useScrollContext } from "~/components/ScrollProvider";

import { api } from "~/utils/api";
import { SaveState } from "@prisma/client";
import { Button } from "@/components/ui/button";

interface PageContentProps {
  setEndpoint: React.Dispatch<React.SetStateAction<string>>;
  setReqElems: React.Dispatch<React.SetStateAction<{ key: string; value: any }[]>>;
  setClassId: React.Dispatch<React.SetStateAction<string>>;
  sharedData: any;
}

const PageContent: React.FC<PageContentProps> = ({
  setEndpoint,
  setReqElems,
  setClassId,
  sharedData
}) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // setFile(event.target.files[0]);
    } else {
      // setFile(null);
    }
  };

  // keep track of the reqElems from setReqElems
  const [trackReqElems, setTrackReqElems] = useState<{ key: string; value: any }[]>([]);
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [trackEndpoint, setTrackEndpoint] = useState<string>("");
  const [trackClassId, setTrackClassId] = useState<string>("");

  const { data: processState, refetch: processRefatch } = api.saveState.getState.useQuery();

  // const refetchProcessState = async () => {
  //   const { refetch } = api.saveState.getState.useQuery();
  //   await refetch();
  // };


  useEffect(() => {    
    // adjust the input focus of the elements
    if (trackReqElems.length === 0) {
      setInputContent(Array(numDataBoxes).fill(true));
      setEndpoint("");
      setClassId("");
    } else {
      const newInputContent = Array(numDataBoxes).fill(false);
      newInputContent[trackIndex] = true;
      setInputContent(newInputContent);
      // setClassId(trackReqElems[0].value);

      setEndpoint(trackEndpoint);
      setClassId(trackClassId);
    }

    // send the reqElems
    setReqElems(trackReqElems);

  }, [trackReqElems]);

  

  useEffect(() => {

    processRefatch()
  }, [sharedData]);

  const numDataBoxes = 4;
  const [inputContent, setInputContent] = useState<boolean[]>(
    Array(numDataBoxes).fill(true)
  );

  const handleInputChange = (
    classId: string,
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    endpoint: string
  ) => {

    const key = event.target.id;
    const value = event.target.value;

    setTrackEndpoint(endpoint);
    setTrackClassId(classId);
  
    setTrackReqElems((prevTrackReqElems) => {
      const indexKey = prevTrackReqElems.findIndex((elem) => elem.key === key);

      setTrackIndex(index);
  
      if (value.length === 0) {
        // remove the key from the trackReqElems
        if (indexKey !== -1) {
          return prevTrackReqElems.filter((elem) => elem.key !== key);
        }
        return prevTrackReqElems;
      }
  
      // create the key with the id and append if it doesn't exist
      if (indexKey === -1) {
        const updatedTrackReqElems = [...prevTrackReqElems, { key: key, value: value }];
        return updatedTrackReqElems;
      }

      // Update the key with the id if it exists
      if (indexKey !== -1) {
        const updatedTrackReqElems = prevTrackReqElems.map((elem) =>
          elem.key === key ? { ...elem, value: value } : elem
        );
        return updatedTrackReqElems;
      }
  
      return prevTrackReqElems;
    });
  };
  

  const { scrollToBottom } = useScrollContext();

  return (
    <div className="w-4/5 mr-8 min-h-full">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 items-center">
        {/* Conditionally render based on isSaving */}
        {(processState?.state === SaveState.saving) ? (
          <div>
            <p>Saving...</p>
            {/* You can display a loading bar here */}
          </div>
        ) : (
          dataBoxConfigurations.map((config, index) => {
            const { component: DataBoxComponent, endpoint, id } = config;

            // Define the props you want to pass to DataBoxComponent
            const dataBoxProps = {
              handleFileChange,
              handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange(id, event, index, endpoint), // Pass the index to handleInputChange
              inputContent,
            };

            return (
              <div key={index}>
                <DataBoxComponent {...dataBoxProps} />
              </div>
            );
          })
        )}

        <Button 
          className="absolute bottom-4 left-4 text-cyan-700 py-2 px-4 border border-cyan-700 transition duration-300 hover:bg-cyan-700 hover:text-white rounded-xl"
          onClick={scrollToBottom}
          >
          Scroll to Bottom
        </Button>

        {/* <button
          
          onClick={scrollToBottom}
        >
          Scroll to Bottom
        </button> */}
      </div>
    </div>
  );

};

export default PageContent;
