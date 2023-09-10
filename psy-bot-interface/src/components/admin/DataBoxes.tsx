import React, { useState } from "react";
import DataBox from "./DataBox";

// Define DataBox components separately
interface DataBoxProps {
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    inputContent: boolean[];
  }
  

  const YoutubeDataBox = ({
    handleInputChange,
    inputContent,
  }: DataBoxProps) => {
    return (
      <DataBox title="Youtube URL:" enabled={inputContent[0]} id="youtube">
        <input
          type="text"
          onChange={handleInputChange}
          onInput={handleInputChange}
        />
      </DataBox>
    );
  }
  

  const FileDataBox = ({
    handleFileChange,
    handleInputChange,
    inputContent,
  }: DataBoxProps) => (
    <DataBox
        title="File:"
        enabled={inputContent[1]}
        id="file"
        endpoint="/default-endpoint"
    >
      <input
        type="file"
        onChange={handleFileChange}
        onInput={handleInputChange}
      />
    </DataBox>
  );

  const QaDataBox = ({
    handleInputChange,
    inputContent,
  }: DataBoxProps) => (
    <DataBox
        title="Q&A"
        enabled={inputContent[2]}
        id="qa"
        endpoint="/default-endpoint"
    >
      <p>Category</p>
      <input type="text" onInput={handleInputChange} />
      <p>Question</p>
      <input type="text" onInput={handleInputChange} />
      <p>Answer</p>
      <input type="text" onInput={handleInputChange} />
    </DataBox>
  );

  const TextDataBox = ({
    handleInputChange,
    inputContent,
  }: DataBoxProps) => (
    <DataBox
        title="Text"
        enabled={inputContent[3]}
        id="data"
        endpoint="/default-endpoint"
    >
      <p>Description</p>
      <input type="text" onInput={handleInputChange} />
    </DataBox>
  );

  // Define dataBoxes as an array of DataBox components
  export const dataBoxConfigurations = [
    {
      component: YoutubeDataBox,
      endpoint: "/your-endpoint-here",
      id: "youtube",
    },
    {
        component: FileDataBox,
        endpoint: "/your-endpoint-here",
        id: "file",
    },
    {
        component: QaDataBox,
        endpoint: "/your-endpoint-here",
        id: "qa",
    },
    {
        component: TextDataBox,
        endpoint: "/your-endpoint-here",
        id: "data",
    },
    // Add other DataBox configurations here
  ];