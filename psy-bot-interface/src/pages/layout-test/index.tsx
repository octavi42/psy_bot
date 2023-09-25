import { ReactElement } from "react";
import GlobalRootLayout from "~/components/layouts/GlobalLayout";

 
const TestLayoutPage = () => {
  return (
      <p>hello world</p>
  )
}


TestLayoutPage.PageLayout = GlobalRootLayout;


// TestLayoutPage.getLayout = function getLayout(page: ReactElement, layout: ReactElement) {
//   return (
//     <div>
//       <GlobalRootLayout>
//         {page}
//       </GlobalRootLayout>
//     </div>
//   )
// }

export default TestLayoutPage;
