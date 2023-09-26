import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { ReactElement } from "react";
import GlobalRootLayout from "../../components/layouts/GlobalLayout";
import { AlertDialogDemo } from "~/components/Alert";
// import { AlertDialogDemo } from "~/components/Alert";
// import GlobalRootLayout from "~/components/layouts/GlobalLayout";

 
const TestLayoutPage = () => {
  return (
    <>
      <p>hello world</p>
      <AlertDialogDemo />
    </>
  )
}


TestLayoutPage.PageLayout = GlobalRootLayout;


TestLayoutPage.getLayout = function getLayout(page: ReactElement, layout: ReactElement) {
  return (
    <div>
      <GlobalRootLayout>
        {page}
      </GlobalRootLayout>
    </div>
  )
}

export default TestLayoutPage;
