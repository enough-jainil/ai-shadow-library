
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryLabels, ContentCategory } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { Github, Loader2 } from "lucide-react";
import { useGitHub } from "@/hooks/useGitHub";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function Submit() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ContentCategory | "">("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [previewTab, setPreviewTab] = useState("edit");
  const [isGitHubAuthenticated, setIsGitHubAuthenticated] = useState(false);
  const [gitHubToken, setGitHubToken] = useState<string | null>(null);
  const [gitHubUser, setGitHubUser] = useState<GitHubUser | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const GITHUB_CLIENT_ID = "Ov23libTNf3lYbpKBN8f";
  const REDIRECT_URI = window.location.origin + "/auth/github/callback";

  const handleGitHubLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=read:user%20public_repo%20discussion:write`;
    window.location.assign(githubAuthUrl);
  };

  const handleGitHubCallback = async (code: string) => {
    console.log("Received GitHub code:", code);
    toast({
      title: "Login Pending",
      description: "Backend needed to complete login.",
      variant: "default",
    });
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const fetchGitHubUser = async (token: string) => {
    console.log("Fetching GitHub user with token:", token);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      handleGitHubCallback(code);
    }

    const storedToken = sessionStorage.getItem("github_token");
    if (storedToken) {
      setGitHubToken(storedToken);
      setIsGitHubAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (gitHubToken) {
      sessionStorage.setItem("github_token", gitHubToken);
    } else {
      sessionStorage.removeItem("github_token");
    }
  }, [gitHubToken]);

  const { isAuthenticated, createDiscussion, isLoading } = useGitHub();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!title || !description || !content || !category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "GitHub Login Required",
        description: "Please log in with GitHub to submit content.",
        variant: "destructive",
      });
      return;
    }

    const discussionBody = `
## Description
${description}

## Category
${category}

## Content
${content}

${tags ? `## Tags\n${tags}` : ''}
${author ? `## Author\n${author}` : 'Anonymous'}
    `.trim();

    try {
      const result = await createDiscussion(title, discussionBody, category);
      
      if (result) {
        setTitle("");
        setDescription("");
        setContent("");
        setCategory("");
        setTags("");
        setAuthor("");
        setPreviewTab("edit");
      } else {
        setSubmitError("Failed to create discussion. Please try again or contact support.");
      }
    } catch (error) {
      console.error("Error submitting content:", error);
      setSubmitError("An unexpected error occurred. Please try again or contact support.");
    }
  };

  // Define a simple type for the GitHub user
  type GitHubUser = {
    login: string;
    id: number;
    avatar_url: string;
    name?: string;
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 font-mono">Submit Content</h1>

          <div className="neo-blur p-6 mb-8">
            <p>
              Share your AI discoveries with the community. All submissions are
              reviewed before being published. Your content should be
              educational and provide value to researchers and enthusiasts.
            </p>
          </div>

          {submitError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

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
                <Select
                  value={category}
                  onValueChange={(value) =>
                    setCategory(value as ContentCategory)
                  }
                >
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
                Markdown formatting is supported. Use # for headings, * for
                lists, `code` for code, etc.
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

            <div className="pt-4 flex flex-col md:flex-row gap-4 items-center">
              {isGitHubAuthenticated ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {/* Optionally display GitHub username */}
                  {gitHubUser && (
                    <span className="font-medium">
                      Logged in as {gitHubUser.login}
                    </span>
                  )}
                  {/* <span>Logged in with GitHub</span> */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGitHubToken(null);
                      setIsGitHubAuthenticated(false);
                      setGitHubUser(null);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGitHubLogin}
                  className="w-full md:w-auto"
                >
                  <Github className="mr-2 h-4 w-4" /> Login with GitHub to
                  Submit
                </Button>
              )}

              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={!isGitHubAuthenticated || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : isGitHubAuthenticated ? (
                  "Submit Content & Create Discussion"
                ) : (
                  "Submit Content (Login Required)"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
