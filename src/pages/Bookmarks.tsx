
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useGitHubAuthContext } from "@/components/GitHubAuthProvider";
import { getUserBookmarks } from "@/lib/bookmarkService";
import { ContentItem, getContentById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/ContentCard";

export default function Bookmarks() {
  const { user, login, isLoading: isAuthLoading } = useGitHubAuthContext();
  const [bookmarkedContent, setBookmarkedContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const bookmarkIds = await getUserBookmarks(user.id.toString());
        const contentItems = bookmarkIds
          .map(id => getContentById(id))
          .filter((item): item is ContentItem => !!item);
        
        setBookmarkedContent(contentItems);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchBookmarks();
    } else if (!isAuthLoading) {
      setIsLoading(false);
    }
  }, [user, isAuthLoading]);
  
  if (!user && !isAuthLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-6 font-mono">Bookmarks</h1>
            <div className="neo-blur p-6 mb-8">
              <p className="mb-4">
                You need to be logged in to view your bookmarks.
              </p>
              <Button onClick={login}>Login with GitHub</Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 font-mono">Your Bookmarks</h1>
          
          {isLoading ? (
            <div className="neo-blur p-6 text-center">
              <p>Loading your bookmarks...</p>
            </div>
          ) : bookmarkedContent.length === 0 ? (
            <div className="neo-blur p-6 text-center">
              <p className="mb-4">You haven't bookmarked any content yet.</p>
              <Button asChild>
                <a href="/browse">Browse Content</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedContent.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
