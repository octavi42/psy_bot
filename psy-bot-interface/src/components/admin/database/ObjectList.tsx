import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import axios from "axios";


const ObjectList = () => {

    const { data: sessionData } = useSession();
    const { data: objectData, isFetching: isObjectsLoading } =
    api.object.getAll.useQuery();
    const { mutate: deleteObject} = api.object.deleteObject.useMutation();

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
        <div className="p-8 relative h-auto" style={{ scrollSnapAlign: 'start' }}>
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
    )
}

export default ObjectList;