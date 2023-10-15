import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { Toaster } from "@/components/ui/toaster";


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}


type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}


type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType;
  }
}


function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: ComponentWithPageLayout) {
  return (
    <div>
      {Component.PageLayout ? (
        <Component.PageLayout>
            <SessionProvider session={session}>
                <Toaster />
                <Component {...pageProps} />
            </SessionProvider>
          </Component.PageLayout>
      ) : (
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      )}
  </div>
  )
};

export default api.withTRPC(MyApp);





// import { type Session } from "next-auth";
// import { SessionProvider } from "next-auth/react";
// import { AppProps, type AppType } from "next/app";
// import { api } from "~/utils/api";
// import "~/styles/globals.css";
// import { ReactElement, ReactNode } from "react";
// import { NextPage } from "next";


// export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
//   getLayout?: (page: ReactElement) => ReactNode
// }


// type AppPropsWithLayout = AppProps & {
//   Component: NextPageWithLayout
// }

// const MyApp: AppType<{ session: Session | null }> = ({
//   Component,
//   pageProps: { session, ...pageProps },
// }: AppPropsWithLayout) => {
//   const getLayout = Component.getLayout ?? ((page) => page)

//   return getLayout((
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   ));
// };

// export default api.withTRPC(MyApp);





 
// type AppPropsWithLayout = AppProps & {
//   Component: NextPageWithLayout
// }
 
// export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
//   // Use the layout defined at the page level, if available
//   const getLayout = Component.getLayout ?? ((page) => page)
 
//   return getLayout(<Component {...pageProps} />)
// }