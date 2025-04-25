import { useState } from "react";
import {
  ContentCategory,
  categoryLabels,
  getAllTags,
  mockContent,
} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BrowseFiltersProps {
  selectedCategories: ContentCategory[];
  setSelectedCategories: (categories: ContentCategory[]) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function BrowseFilters({
  selectedCategories,
  setSelectedCategories,
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery,
}: BrowseFiltersProps) {
  const allTags = getAllTags(mockContent);
  const [tagFilter, setTagFilter] = useState("");

  const filteredTags = tagFilter
    ? allTags.filter((tag) =>
        tag.toLowerCase().includes(tagFilter.toLowerCase())
      )
    : allTags;

  const categories = Object.keys(categoryLabels) as ContentCategory[];

  const toggleCategory = (category: ContentCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchQuery("");
    setTagFilter("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2 text-sm tracking-tight">Search</h3>
        <div className="relative">
          <Input
            type="search"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-sm tracking-tight">Categories</h3>
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategories([])}
              className="h-auto text-xs py-1"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={
                selectedCategories.includes(category) ? "default" : "outline"
              }
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              {categoryLabels[category]}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-sm tracking-tight">Tags</h3>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
              className="h-auto text-xs py-1"
            >
              Clear
            </Button>
          )}
        </div>
        <Input
          type="search"
          placeholder="Filter tags..."
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="w-full mb-2"
        />
        <ScrollArea className="h-[180px]">
          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {(selectedCategories.length > 0 ||
        selectedTags.length > 0 ||
        searchQuery) && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
