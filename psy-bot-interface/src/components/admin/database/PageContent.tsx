import React, { useEffect, useState } from "react";
import DataBox from "../DataBox";
import { dataBoxConfigurations } from "../DataBoxes";
import { useScrollContext } from "~/components/ScrollProvider";
import { set } from "zod";

interface PageContentProps {
  setInuse: React.Dispatch<React.SetStateAction<boolean>>;
  setEndpoint: React.Dispatch<React.SetStateAction<string>>;
  setReqElems: React.Dispatch<React.SetStateAction<{ key: string; value: any }[]>>;
}

const PageContent: React.FC<PageContentProps> = ({
  setInuse,
  setEndpoint,
  setReqElems
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

  useEffect(() => {    
    // adjust the input focus of the elements
    if (trackReqElems.length === 0) {
      setInputContent(Array(numDataBoxes).fill(true));
      setEndpoint("");
    } else {
      const newInputContent = Array(numDataBoxes).fill(false);
      newInputContent[trackIndex] = true;
      setInputContent(newInputContent);

      setEndpoint(trackEndpoint);
    }

    // send the reqElems
    setReqElems(trackReqElems);

  }, [trackReqElems]);

  const numDataBoxes = 4;
  const [inputContent, setInputContent] = useState<boolean[]>(
    Array(numDataBoxes).fill(true)
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    endpoint: string
  ) => {
    const key = event.target.id;
    const value = event.target.value;

    setTrackEndpoint(endpoint);
  
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
    <div className="w-4/5 mr-8">
      <h2 className="text-2xl font-semibold mb-6">Admin Database</h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {dataBoxConfigurations.map((config, index) => {
          const { component: DataBoxComponent, endpoint } = config;

          // Define the props you want to pass to DataBoxComponent
          const dataBoxProps = {
            handleFileChange,
            handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(event, index, endpoint), // Pass the index to handleInputChange
            inputContent,
          };

          return (
            <div key={index}>
              <DataBoxComponent {...dataBoxProps} />
            </div>
          );
        })}

        <button
          className="absolute bottom-4 left-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={scrollToBottom}
        >
          Scroll to Bottom
        </button>
      </div>
    </div>
  );
};

export default PageContent;
