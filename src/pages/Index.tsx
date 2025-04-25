
import { Layout } from "@/components/Layout";
import { ContentCard } from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getFeaturedContent, getLatestContent, categoryIcons, categoryDescriptions, ContentCategory } from "@/lib/data";

export default function Home() {
  const featuredContent = getFeaturedContent();
  const latestContent = getLatestContent(3);
  
  const categories: ContentCategory[] = [
    'jailbreak', 'system-prompt', 'leak', 'tool', 'technique', 'document'
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 md:py-24 overflow-hidden">
        <div className="matrix-bg absolute inset-0 pointer-events-none"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold font-mono mb-6">
              <span className="text-primary glow-text">AI Shadow Library</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              Underground repository of leaked AI prompts, jailbreak techniques,
              system documents, and forbidden knowledge
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/browse">Browse Library</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/submit">Submit Content</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 border-y border-border/40">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 font-mono">Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link 
                key={category}
                to={`/browse?category=${category}`}
                className="neo-blur p-4 flex flex-col h-full transition-all duration-300 hover:border-primary/40 hover:bg-black/60"
              >
                <div className="text-3xl mb-2">{categoryIcons[category]}</div>
                <h3 className="text-lg font-bold mb-1 font-mono">{category.replace('-', ' ')}</h3>
                <p className="text-sm text-muted-foreground">{categoryDescriptions[category]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-12">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-mono">Featured Content</h2>
            <Button variant="ghost" asChild>
              <Link to="/browse">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredContent.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Content Section */}
      <section className="py-12 border-t border-border/40">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-mono">Latest Additions</h2>
            <Button variant="ghost" asChild>
              <Link to="/browse">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestContent.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-border/40">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-6 font-mono">Contribute to the Library</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Have a jailbreak technique, leaked document, or undocumented system prompt? 
            Share it with the community anonymously.
          </p>
          <Button size="lg" asChild>
            <Link to="/submit">Submit Content</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
