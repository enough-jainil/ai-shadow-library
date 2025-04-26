// 1. Define the single source of truth for category data
const CATEGORIES = {
  jailbreak: {
    label: "Jailbreak",
    icon: "🔓",
    description: "Methods to bypass AI safety measures and restrictions",
  },
  "system-prompt": {
    label: "System Prompt",
    icon: "⚙️",
    description: "Prompts used to define AI system behavior",
  },
} as const; // Use 'as const' for stricter typing

// 2. Derive the ContentCategory type from the keys of CATEGORIES
export type ContentCategory = keyof typeof CATEGORIES;

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: ContentCategory;
  tags: string[];
  author: string;
  createdAt: string;
  featured?: boolean;
  views?: number; // Add views as an optional property
};

// Import markdown content as raw string
import {
  cursorPromptAgentContent,
  cursorPromptChatContent,
  devinAiContent,
} from "./imports";
// Sample mock data
export const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "Cursor Prompt(agent)",
    description: "Methods to bypass AI safety measures and restrictions",
    content: cursorPromptAgentContent,
    category: "system-prompt",
    tags: ["ai", "cursor", "prompt", "agent", "system-prompt"],
    author: "x1xhlol",
    createdAt: "2025-03-26",
    featured: false,
  },
  {
    id: "2",
    title: "Cursor Prompt(chat)",
    description: "Methods to bypass AI safety measures and restrictions",
    content: cursorPromptChatContent,
    category: "system-prompt",
    tags: ["ai", "cursor", "prompt", "chat", "system-prompt"],
    author: "x1xhlol",
    createdAt: "2025-04-23",
    featured: false,
  },
  {
    id: "3",
    title: "Devin AI",
    description: "Devin AI",
    content: devinAiContent,
    category: "system-prompt",
    tags: ["ai", "devin", "ai-agent", "system-prompt"],
    author: "x1xhlol",
    createdAt: "2025-04-17",
    featured: false,
  },
];

// Filter functions for searching and filtering content
export const searchContent = (
  items: ContentItem[],
  query: string,
  selectedCategories: ContentCategory[] = [],
  selectedTags: string[] = []
): ContentItem[] => {
  // First filter by categories if any are selected
  let filtered = items;

  if (selectedCategories.length > 0) {
    filtered = filtered.filter((item) =>
      selectedCategories.includes(item.category)
    );
  }

  // Then filter by tags if any are selected
  if (selectedTags.length > 0) {
    filtered = filtered.filter((item) =>
      selectedTags.some((tag) => item.tags.includes(tag))
    );
  }

  // Finally, filter by search query if present
  if (query && query.trim() !== "") {
    const lowerQuery = query.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  return filtered;
};

// Get all unique tags from the content
export const getAllTags = (items: ContentItem[]): string[] => {
  const tagSet = new Set<string>();

  items.forEach((item) => {
    item.tags.forEach((tag) => {
      tagSet.add(tag);
    });
  });

  return Array.from(tagSet).sort();
};

// 4. Automatically generate categoryLabels, categoryIcons, and categoryDescriptions
export const categoryLabels = Object.fromEntries(
  Object.entries(CATEGORIES).map(([key, { label }]) => [key, label])
) as Record<ContentCategory, string>;

export const categoryIcons = Object.fromEntries(
  Object.entries(CATEGORIES).map(([key, { icon }]) => [key, icon])
) as Record<ContentCategory, string>;

export const categoryDescriptions = Object.fromEntries(
  Object.entries(CATEGORIES).map(([key, { description }]) => [key, description])
) as Record<ContentCategory, string>;

// Get a content item by ID
export const getContentById = (id: string): ContentItem | undefined => {
  return mockContent.find((item) => item.id === id);
};

// Get featured content items
export const getFeaturedContent = (): ContentItem[] => {
  return mockContent.filter((item) => item.featured);
};

// Get most viewed content items (since views might not be available on all items, we will sort by createdAt as fallback)
export const getMostViewedContent = (limit: number = 5): ContentItem[] => {
  // Use a fallback sorting method if views is not available
  return [...mockContent]
    .sort((a, b) => {
      // If both items have views, sort by views
      if (a.views !== undefined && b.views !== undefined) {
        return b.views - a.views;
      }
      // Otherwise, sort by date as fallback
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit);
};

// Get most recent content items
export const getLatestContent = (limit: number = 5): ContentItem[] => {
  return [...mockContent]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
};

import { slugify } from "./utils";

// Get a content item by slug
export const getContentBySlug = (slug: string): ContentItem | undefined => {
  return mockContent.find((item) => slugify(item.title) === slug);
};

// Get random content items (for related content)
export const getRelatedContent = (
  currentSlug: string,
  limit: number = 3
): ContentItem[] => {
  const filtered = mockContent.filter(
    (item) => slugify(item.title) !== currentSlug
  );
  return filtered.sort(() => 0.5 - Math.random()).slice(0, limit);
};
