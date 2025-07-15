import React from "react";
import { BlogPost } from "../pages/Blog";
import { Link } from "react-router-dom";

interface BlogPreviewCardProps {
  post: BlogPost;
}

const BlogPreviewCard: React.FC<BlogPreviewCardProps> = ({ post }) => {
  return (
    <Link to={`/blog/${post.id}`} className="block group">
      <div className="p-4 sm:p-5 border rounded-xl bg-card shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer group-hover:border-primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</span>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base line-clamp-2">{post.summary}</p>
      </div>
    </Link>
  );
};

export default BlogPreviewCard; 