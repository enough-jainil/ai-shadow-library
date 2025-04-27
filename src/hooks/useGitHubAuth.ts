import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// GitHub OAuth configuration
const CLIENT_ID = 'Ov23libTNf3lYbpKBN8f';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

export function useGitHubAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a token in sessionStorage
    const token = sessionStorage.getItem('github_token');
    if (token) {
      fetchUserData(token);
    } else {
      setIsLoading(false);
    }
    
    // Check if the current URL has a code parameter (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      exchangeCodeForToken(code);
    }
  }, []);

  const login = () => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'read:user user:email',
    });
    
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  };

  const logout = () => {
    sessionStorage.removeItem('github_token');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const exchangeCodeForToken = async (code: string) => {
    setIsLoading(true);
    try {
      // Typically this should be done on the server side to keep the client secret safe
      // For demo purposes, we'll simulate this exchange
      // In production, create a backend endpoint to handle this exchange
      
      // This is a mockup - in reality you would call your backend
      const response = await fetch(`https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: 'f666c8ab2179b17021af5d24964d923fd4815ba7', // This should be on server side!
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });
      
      const data = await response.json();
      
      if (data.access_token) {
        sessionStorage.setItem('github_token', data.access_token);
        await fetchUserData(data.access_token);
        
        // Remove the code from URL to prevent re-exchanges
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to authenticate with GitHub",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      sessionStorage.removeItem('github_token');
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, login, logout };
}
