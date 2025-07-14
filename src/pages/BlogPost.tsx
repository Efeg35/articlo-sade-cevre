import React from "react";
import { useParams, Link } from "react-router-dom";
import { blogPosts } from "./Blog";
import type { BlogPost } from "./Blog";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4 text-destructive">Makale bulunamadı</h1>
        <Link to="/blog" className="text-primary hover:underline">← Tüm Makaleler</Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/blog" className="text-muted-foreground hover:text-foreground text-sm">
            ← Tüm Makaleler
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="text-sm text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg prose-neutral max-w-none text-foreground prose-headings:font-bold prose-headings:text-foreground prose-strong:font-bold prose-strong:text-foreground">
          <div 
            className="text-lg leading-7 space-y-4 [&_strong]:font-bold [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/^(\d+\.\s+[^:]+:)/gm, '<strong>$1</strong>')
                .replace(/\n/g, '<br/>')
            }}
          />
        </article>

        {/* Footer Navigation */}
        <footer className="mt-16 pt-8 border-t">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            ← Tüm Makaleler
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default BlogPost; 