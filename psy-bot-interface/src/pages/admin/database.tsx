import React, { useState } from "react";
import AdminLayout from "~/components/admin/AdminLayout";
import PageContent from "~/components/admin/database/PageContent";
import ObjectList from "~/components/admin/database/ObjectList";
import UploadComponent from "~/components/admin/database/UploadComponent";
import { ScrollProvider } from "~/components/ScrollProvider";

const AdminDatabase: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");

  return (
    <AdminLayout>
      <ScrollProvider> {/* Wrap your main page content with ScrollProvider */}
        <div
          className="p-8 relative min-h-screen h-full flex w-full pb-40"
          style={{ scrollSnapAlign: "start" }}
        >
          <PageContent youtubeUrl={youtubeUrl} setYoutubeUrl={setYoutubeUrl} />
          <UploadComponent youtubeUrl={youtubeUrl} />
        </div>
        <ObjectList />
      </ScrollProvider>
    </AdminLayout>
  );
};

export default AdminDatabase;
