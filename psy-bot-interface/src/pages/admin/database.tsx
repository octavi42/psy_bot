import React, { useState } from "react";
import AdminLayout from "~/components/admin/AdminLayout";
import PageContent from "~/components/admin/database/PageContent";
import ObjectList from "~/components/admin/database/ObjectList";
import UploadComponent from "~/components/admin/database/UploadComponent";
import { ScrollProvider } from "~/components/ScrollProvider";

type AdminDatabaseProps = {};

const AdminDatabase: React.FC<AdminDatabaseProps> = () => {
  const [inuse, setInuse] = useState<boolean>(false); // Example for inuse
  const [endpoint, setEndpoint] = useState<string>(""); // Example for endpoint

  // array of request server elements, with name and value
  const [reqElems, setReqElems] = useState<{ key: string; value: any }[]>([]);

  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null); // Example for file
  const [answer, setAnswer] = useState<string>(""); // Example for answer
  const [question, setQuestion] = useState<string>(""); // Example for question
  const [category, setCategory] = useState<string>(""); // Example for category
  const [data, setData] = useState<string>(""); // Example for data

  return (
    <AdminLayout>
      <ScrollProvider>
        <div
          className="p-8 relative min-h-screen h-full flex w-full pb-40"
          style={{ scrollSnapAlign: "start" }}
        >
          <PageContent
            setInuse={setInuse}
            setEndpoint={setEndpoint}
            setReqElems={setReqElems}
          />
          <UploadComponent
            inuse={inuse}
            endpoint={endpoint}
            reqElems={reqElems}
          />
        </div>
        <ObjectList />
      </ScrollProvider>
    </AdminLayout>
  );
};

export default AdminDatabase;
