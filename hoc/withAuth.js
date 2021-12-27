import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const withAuth = (WrappedComponent) => {
  const C = (props) => {
    const { loading, currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !currentUser) {
        router.replace("/");
      }
    }, [loading, router, currentUser]);

    if (currentUser) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };

  return C;
};

export default withAuth;
