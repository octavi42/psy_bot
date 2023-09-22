import React, { useState } from "react";
import AdminLayout from "~/components/admin/AdminLayout";
import PageContent from "~/components/admin/database/PageContent";
import ObjectList from "~/components/admin/database/ObjectList";
import UploadComponent from "~/components/admin/database/UploadComponent";
import { ScrollProvider } from "~/components/ScrollProvider";
import { requireAdminAuthentication, requireAuthentication, requireContributionAuthentication } from "~/actions/auth";

type AdminDatabaseProps = {};

const AdminDatabase: React.FC<AdminDatabaseProps> = () => {
  const [inuse, setInuse] = useState<boolean>(false); // Example for inuse
  const [endpoint, setEndpoint] = useState<string>(""); // Example for endpoint
  const [classId, setClassId] = useState<string>(""); // Example for classId

  const [sharedData, setSharedData] = useState<any>(null);


  // array of request server elements, with name and value
  const [reqElems, setReqElems] = useState<{ key: string; value: any }[]>([]);

  return (
    <AdminLayout>
      <ScrollProvider>
        <div
          className="p-8 relative min-h-screen h-full flex w-full pb-40"
          style={{ scrollSnapAlign: "start" }}
        >
          <PageContent
            setEndpoint={setEndpoint}
            setReqElems={setReqElems}
            setClassId={setClassId}
            sharedData={sharedData}
          />
          <UploadComponent
            endpoint={endpoint}
            reqElems={reqElems}
            classId={classId}
            setSharedData={setSharedData}
          />
        </div>
        <ObjectList />
      </ScrollProvider>
    </AdminLayout>
  );
};

export default AdminDatabase;


export const getServerSideProps = requireContributionAuthentication;