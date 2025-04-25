import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import {
  getContentBySlug,
  getRelatedContent,
  categoryLabels,
  ContentItem,
} from "@/lib/data";
import { formatDate, getContentUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/ContentCard";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";

export default function ContentDetail() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem | undefined>(undefined);
  const [relatedContent, setRelatedContent] = useState<ContentItem[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      const foundContent = getContentBySlug(slug);
      setContent(foundContent);
      setIsCopied(false);

      if (foundContent) {
        // Redirect to the correct URL if needed
        const correctUrl = getContentUrl(
          foundContent.title,
          foundContent.category
        );
        if (window.location.pathname !== correctUrl) {
          navigate(correctUrl, { replace: true });
        }

        const related = getRelatedContent(slug, 3);
        setRelatedContent(related);
      }
    }
  }, [slug, category, navigate]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!content) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
          <p className="mb-6">
            The content you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/browse">Browse Content</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <main className="col-span-12 lg:col-span-8">
            <div className="mb-6">
              <Link
                to="/browse"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Browse
              </Link>
            </div>

            {/* Content Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>{categoryLabels[content.category]}</Badge>
                {content.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-3">{content.title}</h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                <div>By {content.author}</div>
                <div>•</div>
                <div>{formatDate(content.createdAt)}</div>
                {/* <div>•</div> */}
                {/* <div>{content.views} views</div> */}
              </div>

              <p className="text-lg">{content.description}</p>
            </div>

            {/* Content Body */}
            <div className="neo-blur p-6 mb-8 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => handleCopy(content.content)}
                aria-label="Copy content"
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <div className="markdown whitespace-pre-wrap break-words">
                <ReactMarkdown>{content.content}</ReactMarkdown>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {content.tags.map((tag) => (
                <Link key={tag} to={`/browse?tag=${tag}`}>
                  <Badge variant="outline">#{tag}</Badge>
                </Link>
              ))}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="sticky top-20 space-y-6">
              {/* Related Content */}
              <div>
                <h3 className="text-lg font-bold mb-4 font-mono">
                  Related Content
                </h3>
                <div className="space-y-3">
                  {relatedContent.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="neo-blur p-4">
                <h4 className="font-bold mb-2">Have similar content?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Help expand our library with your own prompts, jailbreaks, or
                  leaked documents.
                </p>
                <Button asChild className="w-full">
                  <Link to="/submit">Submit Content</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
