
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentItem, categoryIcons } from "@/lib/data";
import { formatDate, getContentUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Bookmark, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentCardProps {
  item: ContentItem;
}

export function ContentCard({ item }: ContentCardProps) {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [votes, setVotes] = useState({ up: 0, down: 0 });
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  // Check if content is bookmarked
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsBookmarked(bookmarks.includes(item.id));
    
    // Initialize votes (would come from API in a real app)
    setVotes({
      up: Math.floor(Math.random() * 50),
      down: Math.floor(Math.random() * 10),
    });
  }, [item.id]);

  // Toggle bookmark
  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    let newBookmarks;
    
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id: string) => id !== item.id);
      toast({
        title: "Bookmark removed",
        description: `"${item.title}" removed from bookmarks`,
      });
    } else {
      newBookmarks = [...bookmarks, item.id];
      toast({
        title: "Bookmark added",
        description: `"${item.title}" added to bookmarks`,
      });
    }
    
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  // Handle voting
  const handleVote = (type: "up" | "down", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (userVote === type) {
      // Undo vote
      setVotes(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));
      setUserVote(null);
    } else {
      // Change vote
      setVotes(prev => {
        const newVotes = { ...prev };
        
        if (userVote) {
          newVotes[userVote] -= 1;
        }
        
        newVotes[type] += 1;
        return newVotes;
      });
      
      setUserVote(type);
    }
  };

  // Share content
  const shareContent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = window.location.origin + getContentUrl(item.title, item.category);
    
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied",
          description: "Content link copied to clipboard",
        });
      });
    }
  };

  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2">
              {categoryIcons[item.category]} {item.category.replace("-", " ")}
            </Badge>
            <CardTitle className="line-clamp-2">
              <Link
                to={getContentUrl(item.title, item.category)}
                className="hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={isBookmarked ? "text-primary" : "text-muted-foreground"}
            onClick={toggleBookmark}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {item.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs">+{item.tags.length - 3}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-7 w-7 ${userVote === "up" ? "text-primary" : "text-muted-foreground"}`}
              onClick={(e) => handleVote("up", e)}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span>{votes.up}</span>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-7 w-7 ${userVote === "down" ? "text-primary" : "text-muted-foreground"}`}
              onClick={(e) => handleVote("down", e)}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <span>{votes.down}</span>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-muted-foreground"
              onClick={shareContent}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <span>•</span>
          <span>{formatDate(item.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
