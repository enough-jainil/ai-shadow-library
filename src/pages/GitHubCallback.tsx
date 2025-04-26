import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// This component handles the redirect back from GitHub OAuth
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
        description:
          errorDescription ||
          error ||
          "An unknown error occurred during GitHub login.",
        variant: "destructive",
      });
      // Redirect to submit page or home page after error
      navigate("/submit");
      return;
    }

    if (code) {
      console.log("Callback received code:", code);
      // --- Backend Interaction ---
      // TODO: Send this 'code' to your backend endpoint
      //       (e.g., /api/github/callback) to exchange it for an access token.

      // Example placeholder for calling the backend:
      const exchangeCodeForToken = async (authCode: string) => {
        console.log("Sending code to backend for exchange:", authCode);
        // Replace with your actual backend API call
        // const response = await fetch('/api/github/callback', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ code: authCode })
        // });
        // const data = await response.json();

        // --- Mock Response (Remove when backend is ready) ---
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
        // Define a type for the potential backend response (adapt as needed)
        type BackendResponse =
          | { access_token: string; error?: never; error_description?: never }
          | { access_token?: never; error: string; error_description?: string };

        const data: BackendResponse = {
          // Use the defined type
          access_token: `mock_token_for_${authCode.substring(0, 6)}`,
          // Uncomment below to test error handling
          // error: 'invalid_code',
          // error_description: 'The code passed is incorrect or expired.'
        };
        // --- End Mock Response ---

        if (data.access_token) {
          console.log("Received access token (mock):", data.access_token);
          // Store the token (e.g., sessionStorage)
          sessionStorage.setItem("github_token", data.access_token);
          toast({
            title: "GitHub Login Successful",
            description: "You are now logged in.",
          });
          // Redirect user back to the submit page (or wherever needed)
          navigate("/submit", { replace: true });
        } else {
          console.error(
            "GitHub token exchange failed:",
            data.error_description || data.error || "No access token received" // Use data.error as fallback
          );
          toast({
            title: "GitHub Login Failed",
            description:
              data.error_description ||
              data.error || // Use data.error as fallback
              "Could not obtain access token from backend.",
            variant: "destructive",
          });
          navigate("/submit", { replace: true }); // Redirect back even on failure
        }
      };

      exchangeCodeForToken(code);
    } else {
      // No code and no error? Unexpected. Redirect somewhere.
      console.warn("GitHub callback accessed without code or error.");
      toast({
        title: "Login Issue",
        description: "Received an unexpected response from GitHub.",
        variant: "default", // Change variant to 'default'
      });
      navigate("/submit");
    }
  }, [location, navigate, toast]); // Dependencies for useEffect

  // Render a loading indicator while processing
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg font-semibold">Processing GitHub Login...</p>
        <p className="text-muted-foreground">Please wait.</p>
        {/* You could add a spinner component here */}
      </div>
    </div>
  );
}
