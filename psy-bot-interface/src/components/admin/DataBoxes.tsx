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
      <DataBox title="Youtube" enabled={inputContent[0]} id="youtube">
        <input
            id="url"
            type="text"
            placeholder="Youtube url"
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
      <input id="question_category" type="text" placeholder="Category" onInput={handleInputChange} />
      <input id="question" type="text" placeholder="Question" onInput={handleInputChange} />
      <input id="answer" type="text" placeholder="Answer" onInput={handleInputChange} />
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
        <input id="category" type="text" placeholder="Category" onInput={handleInputChange} />
        <input id="data" type="text" placeholder="Description" onInput={handleInputChange} />
    </DataBox>
  );

  // Define dataBoxes as an array of DataBox components
  export const dataBoxConfigurations = [
    {
        component: YoutubeDataBox,
        endpoint: "index-url",
        id: "Youtube",
    },
    {
        component: FileDataBox,
        endpoint: "index-file",
        id: "File",
    },
    {
        component: QaDataBox,
        endpoint: "index-qa",
        id: "QA",
    },
    {
        component: TextDataBox,
        endpoint: "index-about",
        id: "About",
    },
    // Add other DataBox configurations here
  ];