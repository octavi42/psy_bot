import React, { use, useState } from "react";
import axios from "axios";
import AdminLayout from "~/components/admin/AdminLayout";
import cuid from "cuid";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

type UploadedData = {
  url: string;
  id: number;
  title: string;
  description: string;
  userId: string;
  match: string;
};

type DummyUploadeData = {
  id: number,
  title: string,
  description: string,
  imageUrl: string,
  user: string,
  userId: string
}

const AdminDatabase: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedData, setUploadedData] = useState<DummyUploadeData[]>([]);

  const { data: sessionData } = useSession();
  const { mutate: saveObject } = api.object.createChatObject.useMutation();
  const { mutate: deleteObject} = api.object.deleteObject.useMutation();

  const handleYoutubeUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setYoutubeUrl(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
    //   setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const { data: objectData, isFetching: isObjectsLoading } =
    api.object.getAll.useQuery();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

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
  
      // Handle success or show a message to the user
      // console.log("Upload successful:", response.data);
  
    } catch (error) {
      // Handle error or show an error message to the user
      console.error("Upload failed:", error);
    }
  };
  

  const dummyUploadedData: DummyUploadeData[] = [
    {
      id: 1,
      title: "Sample Title 1",
      description: "This is a sample description for the first uploaded data.",
      imageUrl: "https://dummyimage.com/150x150/ccc/000",
      user: "Jon",
      userId: "sadashjd121"
    },
    {
      id: 2,
      title: "Sample Title 2",
      description: "This is a sample description for the second uploaded data.",
      imageUrl: "https://dummyimage.com/150x150/ccc/000",
      user: "Doe",
      userId: "dsadjhsad13r53"
    },
    // Add more dummy data items as needed
  ];


  const [hoveredItemId, setHoveredItemId] = useState(null);

  const handleMouseEnter = (itemId: any) => {
    setHoveredItemId(itemId);
  };

  const handleMouseLeave = () => {
    setHoveredItemId(null);
  };

  const handleDeleteItem = (itemId: string) => {
    const match = itemId;
    const sender = sessionData?.user.id as string;

    try {

      axios({
          method: "post",
          url: "/api/embed/remove",
          data: {
              match: match,
          },
          headers: { "Content-Type": "application/json" }, // Change to "application/json"
      })
      .then(function () {
        deleteObject(
          {
            id: match,
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
  
      // Handle success or show a message to the user
      // console.log("Upload successful:", response.data);
  
    } catch (error) {
      // Handle error or show an error message to the user
      console.error("Upload failed:", error);
    }
  };

  return (
    <AdminLayout>
      <div className=" pb-0 h-auto bg-white rounded-lg shadow-md">
        <div className="p-8 relative h-screen flex w-full">
          <div className="w-4/5 mr-8">
            <h2 className="text-2xl font-semibold mb-6">Admin Database</h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <div className="bg-gray-100 p-4 rounded-lg">
                <label className="block text-lg font-semibold mb-2">YouTube URL:</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={handleYoutubeUrlChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <label className="block text-lg font-semibold mb-2">File:</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

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
        </div>

        <div className="h-screen p-8">
          <h2 className="text-xl font-semibold mb-4 pt-8">Uploaded Data</h2>
          <ul className="space-y-4">
            {objectData?.map((data) => (
              <li
                key={data.id}
                className="bg-gray-100 p-4 rounded-lg flex space-x-4 items-center relative group"
              >
                {/* Delete button */}
                <button
                  className="absolute mx-auto right-4 p-4 text-red-600 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  onClick={() => handleDeleteItem(data.id)} // Call your delete function here
                >
                  Delete
                </button>
                {/* Item content */}
                <div>
                  <h3 className="text-lg font-semibold">{data.title}</h3>
                  <p className="text-gray-600">{data.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        

      </div> 
      
    </AdminLayout>
  );
};

export default AdminDatabase;
