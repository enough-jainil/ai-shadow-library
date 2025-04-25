import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentItem, categoryIcons } from "@/lib/data";
import { formatDate, getContentUrl } from "@/lib/utils";

interface ContentCardProps {
  item: ContentItem;
}

export function ContentCard({ item }: ContentCardProps) {
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
                to={getContentUrl(item.title)}
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
          <span>{formatDate(item.createdAt)}</span>
          {/* <span>•</span> */}
          {/* <span>{item.views} views</span> */}
        </div>
      </CardFooter>
    </Card>
  );
}
