import React, { useState } from "react";
import DataBox from "./DataBox";

// const dataBoxesData = [
//     {
//         title: "Youtube URL:",
//         id: "youtube",
//         endpoint: "/your-endpoint-here",
//         keys: ["url"]
//     },
//     {
//         title: "File:",
//         id: "file",
//         endpoint: "/your-endpoint-here",
//         keys: ["file"]
//     },
//     {
//         title: "Q&A",
//         id: "qa",
//         endpoint: "/your-endpoint-here",
//         keys: ["category", "question", "answer"]
//     },
//     {
//         title: "Text",
//         id: "data",
//         endpoint: "/your-endpoint-here",
//         keys: ["category", "data"]
//     },
//     // Add other DataBox configurations here
// ]

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
            id="url"
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
        id="file"
        title="File:"
        enabled={inputContent[1]}
    >
      <input
        id="file"
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
    >
      <p>Category</p>
      <input id="category" type="text" onInput={handleInputChange} />
      <p>Question</p>
      <input id="question" type="text" onInput={handleInputChange} />
      <p>Answer</p>
      <input id="answer" type="text" onInput={handleInputChange} />
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
    >
        <p>Category</p>
        <input id="category" type="text" onInput={handleInputChange} />
        <p>Description</p>
        <input id="data" type="text" onInput={handleInputChange} />
    </DataBox>
  );

  // Define dataBoxes as an array of DataBox components
  export const dataBoxConfigurations = [
    {
        component: YoutubeDataBox,
        endpoint: "/index-url",
        id: "youtube",
    },
    {
        component: FileDataBox,
        endpoint: "/index-file",
        id: "file",
    },
    {
        component: QaDataBox,
        endpoint: "/index-qa",
        id: "qa",
    },
    {
        component: TextDataBox,
        endpoint: "/index-about",
        id: "data",
    },
    // Add other DataBox configurations here
  ];