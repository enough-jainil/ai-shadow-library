import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary glow-text text-2xl font-mono font-bold">
              AI
            </span>
            <span className="font-mono text-xl">Shadow_Library</span>
          </Link>
        </div>

        <div className="flex-1 mx-4 max-w-md hidden sm:block">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search prompt library..."
              className="w-full rounded-md bg-background pl-8 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" className="hidden sm:flex" asChild>
            <Link to="/browse">Browse</Link>
          </Button>
          <Button variant="ghost" className="hidden sm:flex" asChild>
            <a
              href="https://github.com/enough-jainil/ai-shadow-library/discussions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Submit
            </a>
          </Button>
        </div>
      </div>

      <div className="container sm:hidden py-2">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search prompt library..."
            className="w-full rounded-md bg-background pl-8 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <nav className="container flex justify-between items-center py-1 sm:hidden border-t border-border/20">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/browse">Browse</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://github.com/enough-jainil/ai-shadow-library/discussions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discuss
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/browse?category=jailbreak">Jailbreaks</Link>
        </Button>
      </nav>
    </header>
  );
}
