import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { blogPosts } from "./Blog";
import type { BlogPost } from "./Blog";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, List, Share2, Twitter, Facebook, Linkedin, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

// Reading time hesaplama fonksiyonu
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200; // Ortalama okuma hızı
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// İçindekiler çıkarma fonksiyonu
const extractTableOfContents = (content: string): { id: string; title: string; level: number }[] => {
  const headings: { id: string; title: string; level: number }[] = [];
  const headingRegex = /<h([2-3])>(.*?)<\/h[2-3]>/g;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const title = match[2].replace(/<[^>]*>/g, '');
    const id = title.toLowerCase().replace(/[^a-z0-9ğüşıöçı\s]/g, '').replace(/\s+/g, '-');
    headings.push({ id, title, level });
  }

  return headings;
};

// Social sharing component
const SocialShare = ({ title, url }: { title: string; url: string }) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link kopyalandı!');
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Paylaş:</span>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank')}
          className="h-8 w-8 p-0"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}
          className="h-8 w-8 p-0"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')}
          className="h-8 w-8 p-0"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

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

  const tableOfContents = extractTableOfContents(post.content);

  // İçeriği ID'ler ile güncelle
  const contentWithIds = post.content.replace(/<h([2-3])>(.*?)<\/h[2-3]>/g, (match, level, title) => {
    const cleanTitle = title.replace(/<[^>]*>/g, '');
    const id = cleanTitle.toLowerCase().replace(/[^a-z0-9ğüşıöçı\s]/g, '').replace(/\s+/g, '-');
    return `<h${level} id="${id}">${title}</h${level}>`;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* SEO Head */}
      <HeadMeta post={post} />

      {/* Enhanced hero section */}
      <section className="py-16 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background"></div>
        <div className="container relative">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm text-primary font-medium">
              <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
              Güncel Rehber
            </div>
            <h1 className="max-w-4xl text-pretty text-4xl font-bold md:text-5xl lg:text-6xl leading-tight">
              {post.title}
            </h1>
            <h3 className="text-muted-foreground max-w-3xl text-lg md:text-xl lg:text-2xl leading-relaxed">
              {post.summary}
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm md:text-base">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src="/logo-transparent.png" />
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <a href="#" className="font-semibold text-foreground hover:text-primary transition-colors">Artiklo Ekibi</a>
                    <span className="text-muted-foreground text-sm">{format(new Date(post.publishedAt), "d MMMM yyyy", { locale: tr })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{calculateReadingTime(post.content)} dk okuma</span>
                </div>
              </div>
              <SocialShare title={post.title} url={window.location.href} />
            </div>
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="mb-8 mt-4 aspect-video w-full rounded-lg border object-cover"
              />
            )}
          </div>
        </div>
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* İçindekiler - Sadece uzun yazılarda göster */}
            {tableOfContents.length > 2 && (
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-card border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <List className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">İçindekiler</h3>
                  </div>
                  <nav className="space-y-2">
                    {tableOfContents.map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.id}`}
                        className={`block text-sm hover:text-primary transition-colors ${heading.level === 2 ? 'font-medium text-foreground' : 'ml-4 text-muted-foreground'
                          }`}
                      >
                        {heading.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            )}

            {/* Ana İçerik */}
            <div className={tableOfContents.length > 2 ? "lg:col-span-3" : "lg:col-span-4"}>
              <div className="prose prose-xl dark:prose-invert mx-auto max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h1:md:text-5xl prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:font-extrabold prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:font-bold prose-h3:mt-10 prose-h3:mb-4 prose-p:text-lg prose-p:md:text-xl prose-p:leading-8 prose-p:mb-6 prose-p:!text-foreground prose-ul:mb-6 prose-li:mb-2 prose-li:!text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:!text-foreground prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg">
                <div
                  className="space-y-6 [&_h2]:text-3xl md:[&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:!text-foreground [&_h2]:scroll-mt-24 [&_h3]:text-2xl md:[&_h3]:text-3xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:!text-foreground [&_h3]:scroll-mt-24 [&_p]:text-lg md:[&_p]:text-xl [&_p]:leading-8 [&_p]:mb-6 [&_p]:!text-foreground [&_ul]:mb-6 [&_ul]:space-y-2 [&_li]:mb-2 [&_li]:text-lg md:[&_li]:text-xl [&_li]:!text-foreground [&_strong]:font-bold [&_strong]:!text-foreground [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline [&_a]:transition-colors"
                  dangerouslySetInnerHTML={{
                    __html: contentWithIds
                  }}
                />
              </div>

              {/* Yazar Bilgisi */}
              <div className="mt-12 p-6 bg-card border rounded-lg">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage src="/logo-transparent.png" />
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2 text-foreground">Artiklo Ekibi</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      Hukuki belgeleri anlaşılır hale getiren yapay zeka destekli platform. Karmaşık yasal metinleri
                      sade Türkçe ile açıklayarak vatandaşların hukuki haklarını daha iyi anlamalarına yardımcı oluyoruz.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <a href="https://artiklo.com" target="_blank" rel="noopener" className="text-primary hover:underline">
                        Artiklo'yu Keşfet
                      </a>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {blogPosts.length} yazı yayınlandı
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* İlgili Yazılar */}
              <div className="mt-16 pt-8 border-t">
                <h3 className="text-2xl font-bold mb-6 text-foreground">İlgili Yazılar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogPosts
                    .filter(relatedPost => relatedPost.id !== post.id)
                    .slice(0, 2)
                    .map(relatedPost => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.id}`}
                        className="group block bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200"
                      >
                        <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                          {relatedPost.summary}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{calculateReadingTime(relatedPost.content)} dk okuma</span>
                          <span>•</span>
                          <span>{format(new Date(relatedPost.publishedAt), "d MMM yyyy", { locale: tr })}</span>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;



// Basit head yönetimi: title/meta/canonical ve FAQ JSON-LD
const HeadMeta = ({ post }: { post: BlogPost }) => {
  useEffect(() => {
    const prevTitle = document.title;
    const title = post.seoTitle || post.title;
    document.title = title;

    // meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    if (post.metaDescription) metaDesc.setAttribute('content', post.metaDescription);

    // canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    if (post.canonical) linkCanonical.setAttribute('href', post.canonical);

    // FAQ JSON-LD
    const faqScript = document.getElementById('faq-jsonld');
    if (faqScript) {
      faqScript.remove();
    }
    if (post.faq && post.faq.length > 0) {
      const script = document.createElement('script');
      script.id = 'faq-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': post.faq.map(q => ({
          '@type': 'Question',
          'name': q.question,
          'acceptedAnswer': { '@type': 'Answer', 'text': q.answer }
        }))
      });
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      // meta/canonical'ı temizlemiyoruz; sonraki sayfa üzerine yazar
      const s = document.getElementById('faq-jsonld');
      if (s) s.remove();
    };
  }, [post]);

  return null;
};