import React, { useState } from "react";
import axios from "axios";
import cuid from "cuid";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

type UploadContentProps = {
  youtubeUrl: string;
};

const UploadComponent = ({ youtubeUrl }: UploadContentProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const { data: sessionData } = useSession();
  const { mutate: saveObject } = api.object.createChatObject.useMutation();
  const { mutate: updateTranscription } = api.object.changeTranscription.useMutation();

  const handleUpload = async () => {
    try {
      setIsLoading(true); // Set loading state to true while waiting for response

      const match = cuid() as string;
      const sender = sessionData?.user.id as string;

      saveObject(
        {
          id: match,
          title: title,
          description: description,
          fileType: "youtube_video",
        },
        { onError(error) { console.log(error) } }
      );
        
      await axios({
        method: "post",
        url: "/api/embed/create",
        data: {
          url: youtubeUrl as string,
          match: match,
          sender: sender,
        },
        headers: { "Content-Type": "application/json" },
      })
        .then(function (response) {
            updateTranscription(
                {
                    id: match,
                    transcription: response.data
                },
                { onError(error) { console.log(error) } }
            )
        })
        .catch(function (response) {
          console.error(response);
        })
        .finally(() => {
          setIsLoading(false); // Set loading state back to false after response
        });
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
