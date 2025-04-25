
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ContentCard } from "@/components/ContentCard";
import { BrowseFilters } from "@/components/BrowseFilters";
import { Separator } from "@/components/ui/separator";
import { mockContent, searchContent, ContentCategory, ContentItem } from "@/lib/data";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") as ContentCategory | null;
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<ContentCategory[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>(mockContent);

  // Update the URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (searchQuery) {
      newParams.set("query", searchQuery);
    }
    
    if (selectedCategories.length === 1) {
      newParams.set("category", selectedCategories[0]);
    }
    
    setSearchParams(newParams);
  }, [searchQuery, selectedCategories, setSearchParams]);

  // Filter the content when search parameters change
  useEffect(() => {
    const filtered = searchContent(mockContent, searchQuery, selectedCategories, selectedTags);
    setFilteredContent(filtered);
  }, [searchQuery, selectedCategories, selectedTags]);

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with Filters */}
          <aside className="md:w-64 lg:w-72 flex-shrink-0">
            <div className="sticky top-20">
              <h2 className="text-lg font-bold mb-4 font-mono">Filter Content</h2>
              <BrowseFilters
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </aside>

          <Separator orientation="vertical" className="hidden md:block" />

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2 font-mono">Browse Content</h1>
              <p className="text-muted-foreground">
                {filteredContent.length} {filteredContent.length === 1 ? 'result' : 'results'} found
              </p>
            </div>

            {filteredContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredContent.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
