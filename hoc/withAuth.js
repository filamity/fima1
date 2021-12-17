import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const withAuth = (WrappedComponent) => {
  const C = (props) => {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!currentUser) {
        router.replace("/");
      }
    }, [router, currentUser]);

    if (currentUser) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };

  return C;
};

export default withAuth;
