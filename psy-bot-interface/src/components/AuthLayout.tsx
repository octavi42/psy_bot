import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {

    const router = useRouter();

    const { data: session, status} = useSession();

    useEffect(() => {
        if (status === "loading") {
            return;
        }
        if(status === "unauthenticated"){
            router.push("/api/auth/signin")
        }
        
        if (!session) {
            router.push("/api/auth/signin")
        }
    }, [status])
        
    return children
}

export default AuthLayout;