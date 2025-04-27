
import { Octokit } from '@octokit/rest';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isContentBookmarked, addBookmark, removeBookmark } from '@/lib/bookmarkService';
import { useGitHubAuthContext } from '@/components/GitHubAuthProvider';

export function useGitHub() {
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [octokit, setOctokit] = useState<Octokit | null>(null);
  const { user } = useGitHubAuthContext();
  // Derive isAuthenticated from user
  const isAuthenticated = !!user;

  // Check for token on mount and token changes
  useEffect(() => {
    const storedToken = sessionStorage.getItem('github_token');
    setToken(storedToken);
    
    if (storedToken) {
      setOctokit(new Octokit({ auth: storedToken }));
    } else {
      setOctokit(null);
    }
  }, []);

  const checkBookmarkStatus = async (contentId: string) => {
    if (!user) return;
    
    try {
      setIsBookmarkLoading(true);
      const bookmarked = await isContentBookmarked(user.id.toString(), contentId);
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const toggleBookmark = async (contentId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to bookmark content",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsBookmarkLoading(true);
      let success;
      
      if (isBookmarked) {
        success = await removeBookmark(user.id.toString(), contentId);
        if (success) {
          setIsBookmarked(false);
          toast({
            title: "Bookmark Removed",
            description: "Content has been removed from your bookmarks",
          });
        }
      } else {
        success = await addBookmark(user.id.toString(), contentId);
        if (success) {
          setIsBookmarked(true);
          toast({
            title: "Bookmark Added",
            description: "Content has been added to your bookmarks",
          });
        }
      }
      
      if (!success) {
        throw new Error("Failed to update bookmark");
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast({
        title: "Bookmark Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      });
    } finally {
      setIsBookmarkLoading(false);
    }
  };

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
    isBookmarked,
    isBookmarkLoading,
    toggleBookmark,
    checkBookmarkStatus,
  };
}
