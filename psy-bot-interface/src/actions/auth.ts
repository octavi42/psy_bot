// auth.ts
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

export const requireAuthentication = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};


export const requireAdminAuthentication = async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);

    if (!session) {
        return {
            redirect: {
            destination: "/api/auth/signin",
            permanent: false,
            },
        };
    }

    if (session.user.role !== "admin") {
        return {
            redirect: {
            destination: "/",
            permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },  
    };
}


export const requireContributionAuthentication = async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);

    console.log(session);

    if (!session) {
        return {
            redirect: {
            destination: "/api/auth/signin",
            permanent: false,
            },
        };
    }

    if (session.user.role !== "contributor" && session.user.role !== "admin") {
        return {
            redirect: {
            destination: "/",
            permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },  
    };
}