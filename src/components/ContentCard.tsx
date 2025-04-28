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
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentCardProps {
  item: ContentItem;
}

export function ContentCard({ item }: ContentCardProps) {
  const { toast } = useToast();

  // Share content
  const shareContent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url =
      window.location.origin + getContentUrl(item.title, item.category);

    if (navigator.share) {
      navigator
        .share({
          title: item.title,
          text: item.description,
          url: url,
        })
        .catch(console.error);
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
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={shareContent}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <span>•</span>
          <span>{formatDate(item.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
