import React, { useState } from "react";
import DataBox from "../DataBox";
import { dataBoxConfigurations } from "../DataBoxes";
import { useScrollContext } from "~/components/ScrollProvider";
import { set } from "zod";

type PageContentProps = {
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
};

const PageContent: React.FC<PageContentProps> = ({ youtubeUrl, setYoutubeUrl }) => {
  const handleYoutubeUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(event.target.value);
  };

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const numDataBoxes = 4;
  const [inputContent, setInputContent] = useState<boolean[]>(
    Array(numDataBoxes).fill(true)
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    // Check if any input has content
    const inputs = [youtubeUrl, /* Add other input values here */];

    console.log(index);

    if (event.target.value === "") {
      setInputContent(Array(numDataBoxes).fill(true));
      return;
    }

    // Set all to false
    setInputContent(Array(numDataBoxes).fill(false));

    // Set the one that has content to true
    setInputContent((prev) => {
      const newInputContent = [...prev];
      newInputContent[index] = true;
      return newInputContent;
    });
  };

  const { scrollToBottom } = useScrollContext();

  return (
    <div className="w-4/5 mr-8">
      <h2 className="text-2xl font-semibold mb-6">Admin Database</h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {dataBoxConfigurations.map((config, index) => {
          const { component: DataBoxComponent } = config;

          // Define the props you want to pass to DataBoxComponent
          const dataBoxProps = {
            handleFileChange,
            handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(event, index), // Pass the index to handleInputChange
            inputContent,
          };

          return (
            <div key={index}>
              <DataBoxComponent
                {...dataBoxProps}
              />
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
