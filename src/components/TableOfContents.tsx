
import { TableOfContents as TableOfContentsIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Get all headings from the content
    const contentEl = document.querySelector(".markdown");
    if (!contentEl) return;
    
    const headingElements = Array.from(
      contentEl.querySelectorAll("h1, h2, h3, h4, h5, h6")
    );
    
    const headingItems: TocItem[] = headingElements.map((el) => {
      const level = parseInt(el.tagName.substring(1));
      const id = el.id || `heading-${Math.random().toString(36).substring(2, 9)}`;
      
      // Add id to the heading if it doesn't have one
      if (!el.id) {
        el.id = id;
      }
      
      return {
        id,
        text: el.textContent || "",
        level,
      };
    });
    
    setHeadings(headingItems);

    // Set up intersection observer to detect active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );
    
    headingElements.forEach((el) => observer.observe(el));
    
    return () => {
      observer.disconnect();
    };
  }, []);

  if (headings.length <= 1) return null;

  return (
    <div className="neo-blur p-4 mb-6">
      <div className="flex items-center gap-2 font-medium mb-3">
        <TableOfContentsIcon className="h-5 w-5" />
        <h3>Table of Contents</h3>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li 
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
            >
              <a
                href={`#${heading.id}`}
                className={`text-sm hover:text-primary transition-colors block ${
                  activeId === heading.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
