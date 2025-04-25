
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryLabels, ContentCategory } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import ReactMarkdown from "react-markdown";

export default function Submit() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ContentCategory | "">("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !content || !category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Content submitted",
      description: "Your content has been submitted for review.",
    });
    
    setTitle("");
    setDescription("");
    setContent("");
    setCategory("");
    setTags("");
    setAuthor("");
    setShowPreview(false);
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 font-mono">Submit Content</h1>
          
          <div className="neo-blur p-6 mb-8">
            <p>
              Share your AI discoveries with the community. All submissions are reviewed before being published.
              Your content should be educational and provide value to researchers and enthusiasts.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as ContentCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a brief description (max 200 characters)"
                maxLength={200}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="content">Content *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? "Edit" : "Preview"}
                </Button>
              </div>
              
              {showPreview ? (
                <div className="min-h-[300px] p-4 rounded-md border markdown">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <MarkdownEditor content={content} onChange={setContent} />
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-xs text-muted-foreground">
                  Example: ai, chatgpt, jailbreak, leak
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Anonymous (leave blank to stay anonymous)"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full md:w-auto">
                Submit Content
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
