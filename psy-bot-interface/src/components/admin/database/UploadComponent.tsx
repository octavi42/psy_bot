
import axios from "axios";
import cuid from "cuid";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";

type UploadContentProps = {
    youtubeUrl: string;
};

const UploadComponent = ({youtubeUrl}: UploadContentProps) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { data: sessionData } = useSession();
    const { mutate: saveObject } = api.object.createChatObject.useMutation();

    const handleUpload = async () => {
    
        try {
          
          // Replace with your API endpoint
          // const response = await axios.post(`/api/embed`, formData);
          
          const match = cuid() as string;
          const sender = sessionData?.user.id as string;
    
          console.log();
          console.log("match generated:");
          console.log(match);
    
          axios({
              method: "post",
              url: "/api/embed/create",
              data: {
                  url: youtubeUrl as string,
                  match: match,
                  sender: sender,
              },
              headers: { "Content-Type": "application/json" }, // Change to "application/json"
          })
          .then(function (response) {
            saveObject(
              {
                id: match,
                title: title,
                description: description,
                transcription: response.data,
                fileType: "youtube_video",
              },
              {
                onError(error) {
                  console.log(error);
                },
              }
            );
          })
          .catch(function (response) {
              console.error(response);
          });
      
        } catch (error) {
          // Handle error or show an error message to the user
          console.error("Upload failed:", error);
        }
      };

      return(
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
                  Upload
                </button>
                  
            </div>
          </div>
      )
}

export default UploadComponent;