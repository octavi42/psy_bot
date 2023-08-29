import { useState } from "react";
import DataBox from "../DataBox"
import { useScrollContext } from "~/components/ScrollProvider";

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
        //   setFile(event.target.files[0]);
        } else {
          setFile(null);
        }
      };

      const { scrollToBottom } = useScrollContext();

      return (
        <div className="w-4/5 mr-8">
          <h2 className="text-2xl font-semibold mb-6">Admin Database</h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <DataBox title="Youtube URL:">
              <input
                type="text"
                value={youtubeUrl}
                onChange={handleYoutubeUrlChange}
              />
            </DataBox>
    
            <DataBox title="File:">
              <input
                type="file"
                onChange={handleFileChange}
              />
            </DataBox>

            <DataBox title="Q&A">
                <p>Category</p>
                <input type="text" />
                <p>Question</p>
                <input type="text" />
                <p>Answer</p>
                <input type="text" />
            </DataBox>

            <DataBox title="Text">
                <p>Description</p>
                <input type="text" />
            </DataBox>

            <button
            // style for the component in center:   className="absolute bottom-4 w-48 left-0 right-0 mx-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            className="absolute bottom-4 left-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              onClick={scrollToBottom} // Scroll to bottom when button is clicked
            >
              Scroll to Bottom
            </button>
          </div>
        </div>
      );
}

export default PageContent;