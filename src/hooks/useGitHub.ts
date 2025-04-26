
import { Octokit } from '@octokit/rest';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useGitHub() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const token = sessionStorage.getItem('github_token');
  const octokit = token ? new Octokit({ auth: token }) : null;

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
      const response = await octokit.graphql(`
        mutation {
          createDiscussion(input: {
            repositoryId: "R_kgDOLFkH4g",
            categoryId: "DIC_kwDOLFkH4M4CcMYu",
            title: "${title}",
            body: "${body}"
          }) {
            discussion {
              id
              url
            }
          }
        }
      `);

      toast({
        title: "Discussion Created",
        description: "Your content has been submitted to GitHub Discussions",
      });

      return response;
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: "Failed to Create Discussion",
        description: "There was an error creating the discussion on GitHub",
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
    isAuthenticated: !!token,
    token,
  };
}
