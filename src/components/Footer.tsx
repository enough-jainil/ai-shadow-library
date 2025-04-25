
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6">
      <div className="container flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-primary glow-text text-xl font-mono font-bold">AI</span>
            <span className="font-mono">Shadow_Library</span>
          </div>
          <div className="text-sm text-muted-foreground">
            A repository of AI knowledge beyond the boundaries
          </div>
        </div>
        
        <div className="flex mt-4 sm:mt-0">
          <nav className="flex gap-4 sm:gap-6">
            <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground">
              Browse
            </Link>
            <Link to="/submit" className="text-sm text-muted-foreground hover:text-foreground">
              Submit
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
          </nav>
        </div>
      </div>
      <div className="container mt-6">
        <div className="text-center text-xs text-muted-foreground">
          This site contains speculative and educational content. Use responsibly.
        </div>
      </div>
    </footer>
  );
}
