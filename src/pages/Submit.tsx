
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryLabels, ContentCategory } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

export default function Submit() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ContentCategory | "">("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [previewTab, setPreviewTab] = useState("edit");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title || !description || !content || !category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real application, this would send data to a server
    toast({
      title: "Content submitted",
      description: "Your content has been submitted for review.",
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setContent("");
    setCategory("");
    setTags("");
    setAuthor("");
    setPreviewTab("edit");
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
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a brief description (max 200 characters)"
                maxLength={200}
                required
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <div className="border rounded-md">
                <Tabs value={previewTab} onValueChange={setPreviewTab}>
                  <TabsList className="border-b rounded-none bg-transparent w-full justify-start">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit" className="p-0">
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter content in Markdown format"
                      required
                      rows={12}
                      className="border-0 focus-visible:ring-0"
                    />
                  </TabsContent>
                  <TabsContent value="preview" className="p-4 min-h-[300px]">
                    {content ? (
                      <div className="markdown">
                        <ReactMarkdown>{content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="text-muted-foreground italic">
                        Nothing to preview yet
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              <p className="text-xs text-muted-foreground">
                Markdown formatting is supported. Use # for headings, * for lists, `code` for code, etc.
              </p>
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
