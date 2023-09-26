import React, { useState } from "react";
// import AdminLayout from "~/pages/admin/sidebar-nav";
import PageContent from "~/components/admin/database/PageContent";
import ObjectList from "~/components/admin/database/ObjectList";
import UploadComponent from "~/components/admin/database/UploadComponent";
import { ScrollProvider } from "~/components/ScrollProvider";
import { requireAdminAuthentication, requireAuthentication, requireContributionAuthentication } from "~/actions/auth";
import SettingsLayout from "~/components/layouts/SettingsLayout";

type AdminDatabaseProps = {};

export default function AdminDatabase() {
  const [inuse, setInuse] = useState<boolean>(false); // Example for inuse
  const [endpoint, setEndpoint] = useState<string>(""); // Example for endpoint
  const [classId, setClassId] = useState<string>(""); // Example for classId

  const [sharedData, setSharedData] = useState<any>(null);


  // array of request server elements, with name and value
  const [reqElems, setReqElems] = useState<{ key: string; value: any }[]>([]);

  return (
      <ScrollProvider>
        <div
          className="p-8 relative min-h-screen flex w-full"
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
  );
};


AdminDatabase.PageLayout = SettingsLayout


export const getServerSideProps = requireContributionAuthentication;