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
    const match = cuid();
    const sender = sessionData?.user.id as string;

    try {
  
      // Replace with your API endpoint
      // const response = await axios.post(`/api/embed`, formData);

      axios({
          method: "post",
          url: "/api/embed",
          data: {
              url: youtubeUrl as string,
              match: cuid() as string,
              sender: sessionData?.user.id as string,
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

  return (
    <AdminLayout>
      <div className="p-8 bg-white rounded-lg shadow-md">
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
        <div className="mt-6">
          <label className="block text-lg font-semibold mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mt-6">
          <label className="block text-lg font-semibold mb-2">Description:</label>
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mt-6">
          <button
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Uploaded Data</h2>
          <ul className="space-y-4">
            {objectData?.map((data) => (
              <li key={data.id} className="bg-gray-100 p-4 rounded-lg flex space-x-4 items-center">
                {/* <img src={data.imageUrl} alt={data.title} className="w-16 h-16 rounded-lg" /> */}
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
