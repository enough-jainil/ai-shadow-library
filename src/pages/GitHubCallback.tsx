
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function GitHubCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      console.error(`GitHub Auth Error: ${error} - ${errorDescription}`);
      toast({
        title: "GitHub Login Failed",
        description: errorDescription || error || "An unknown error occurred during GitHub login.",
        variant: "destructive",
      });
      navigate("/submit");
      return;
    }

    if (code) {
      const exchangeCodeForToken = async (code: string) => {
        try {
          console.log("Exchanging code for token...");
          
          // GitHub's OAuth token endpoint - use a CORS proxy or backend service
          // Since this is client-side, we're using a serverless function via a proxy
          const response = await fetch('https://corsproxy.io/?https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              client_id: "Ov23libTNf3lYbpKBN8f",
              client_secret: "7c91ce77b449ff347de7dcdc1a92faf9fabb9e0b",
              code: code,
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Token response:", data);

          if (data.access_token) {
            sessionStorage.setItem("github_token", data.access_token);
            toast({
              title: "GitHub Login Successful",
              description: "You are now logged in with GitHub.",
            });
          } else {
            throw new Error(data.error_description || "Failed to obtain access token");
          }
        } catch (error) {
          console.error("Token exchange error:", error);
          toast({
            title: "GitHub Login Failed",
            description: "Failed to complete GitHub authentication. Please try again.",
            variant: "destructive",
          });
        }
        navigate("/submit", { replace: true });
      };

      exchangeCodeForToken(code);
    } else {
      // No code or error, redirect back to submit page
      navigate("/submit");
    }
  }, [location, navigate, toast]);

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg font-semibold">Processing GitHub Login...</p>
        <p className="text-muted-foreground">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}
