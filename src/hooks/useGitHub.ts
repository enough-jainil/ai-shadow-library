
import { Octokit } from '@octokit/rest';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useGitHub() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [octokit, setOctokit] = useState<Octokit | null>(null);

  // Check for token on mount and token changes
  useEffect(() => {
    const storedToken = sessionStorage.getItem('github_token');
    setToken(storedToken);
    
    if (storedToken) {
      setOctokit(new Octokit({ auth: storedToken }));
      setIsAuthenticated(true);
    } else {
      setOctokit(null);
      setIsAuthenticated(false);
    }
  }, []);

  const createDiscussion = async (title: string, body: string, category: string) => {
    if (!octokit) {
      toast({
        title: "Authentication Required",
        description: "Please login with GitHub first",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      // Using the proper variable-based GraphQL mutation to avoid escaping issues
      const response = await octokit.graphql({
        query: `
          mutation createDiscussion($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
            createDiscussion(input: {
              repositoryId: $repositoryId,
              categoryId: $categoryId,
              title: $title,
              body: $body
            }) {
              discussion {
                id
                url
              }
            }
          }
        `,
        repositoryId: "R_kgDOLFkH4g",
        categoryId: "DIC_kwDOLFkH4M4CcMYu", 
        title,
        body
      });

      toast({
        title: "Discussion Created",
        description: "Your content has been submitted to GitHub Discussions",
      });

      return response;
    } catch (error: any) {
      console.error('Error creating discussion:', error);
      let errorMessage = "There was an error creating the discussion on GitHub";
      
      // Try to extract a more specific error message
      if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: "Failed to Create Discussion",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createDiscussion,
    isAuthenticated,
    token,
  };
}
