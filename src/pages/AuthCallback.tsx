
import { Layout } from "@/components/Layout";
import { useGitHubAuthContext } from "@/components/GitHubAuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const { isLoading, user } = useGitHubAuthContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to home page after successful authentication
      navigate("/");
    } else if (!isLoading && !user) {
      // If authentication failed, redirect to home page
      navigate("/");
    }
  }, [isLoading, user, navigate]);
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-6 font-mono">Authenticating...</h1>
          <div className="neo-blur p-6 mb-8">
            <p>Please wait while we complete the authentication process.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
