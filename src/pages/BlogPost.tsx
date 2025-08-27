import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { blogPosts } from "./Blog";
import type { BlogPost } from "./Blog";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, List, Share2, Twitter, Facebook, Linkedin, Copy, ArrowRight, ChevronRight, Home, Calendar } from "lucide-react";
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

// Modern Social sharing component
const SocialShare = ({ title, url }: { title: string; url: string }) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // Modern toast notification yerine daha zarif bir çözüm
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  const socialButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank'),
      className: 'hover:bg-blue-50 hover:text-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank'),
      className: 'hover:bg-blue-50 hover:text-blue-700'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank'),
      className: 'hover:bg-blue-50 hover:text-blue-800'
    },
    {
      name: 'Kopyala',
      icon: Copy,
      onClick: copyToClipboard,
      className: 'hover:bg-green-50 hover:text-green-600'
    }
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-muted-foreground hidden sm:block">Paylaş:</span>
      <div className="flex gap-2">
        {socialButtons.map((button) => {
          const Icon = button.icon;
          return (
            <Button
              key={button.name}
              variant="ghost"
              size="sm"
              onClick={button.onClick}
              className={`h-10 w-10 p-0 rounded-full border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-110 ${button.className}`}
              title={`${button.name} ile paylaş`}
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{button.name} ile paylaş</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

// Breadcrumb bileşeni
const Breadcrumb = ({ post }: { post: BlogPost }) => {
  const breadcrumbItems = [
    { name: 'Ana Sayfa', href: '/', icon: Home },
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: `/blog/${post.id}`, current: true }
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
            {item.current ? (
              <span className="font-medium text-foreground truncate max-w-[200px] md:max-w-none" title={item.name}>
                {item.name}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
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

      {/* Breadcrumb ve Modern hero section */}
      <section className="relative bg-gradient-to-b from-muted/20 via-muted/10 to-background py-20 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>

        <div className="container relative">
          {/* Breadcrumb */}
          <div className="max-w-5xl mx-auto mb-8">
            <Breadcrumb post={post} />
          </div>

          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
            {/* Category Badge */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative flex items-center gap-2 px-6 py-3 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-full text-sm text-primary font-semibold shadow-lg">
                <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                Güncel Rehber
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-primary to-primary/60 rounded-full animate-pulse"></span>
              </div>
            </div>

            {/* Title */}
            <h1 className="max-w-4xl text-pretty text-4xl font-extrabold md:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight">
              <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                {post.title}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground max-w-3xl text-lg md:text-xl lg:text-2xl leading-relaxed font-medium">
              {post.summary}
            </p>

            {/* Meta Information */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 w-full max-w-4xl">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-md"></div>
                    <Avatar className="relative h-12 w-12 border-2 border-primary/20 shadow-lg">
                      <AvatarImage src="/logo-transparent.png" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">AR</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col text-left">
                    <a href="#" className="font-bold text-foreground hover:text-primary transition-colors duration-300">
                      Artiklo Hukuk Ekibi
                    </a>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-sm font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Yayın: {format(new Date(post.publishedAt), "d MMMM yyyy", { locale: tr })}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Son güncelleme: {format(new Date(post.publishedAt), "d MMMM yyyy", { locale: tr })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{calculateReadingTime(post.content)} dk okuma</span>
                  </div>
                  <div className="h-4 w-px bg-border"></div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Share2 className="h-4 w-4" />
                    <span className="font-medium">Paylaş</span>
                  </div>
                </div>
              </div>
              <SocialShare title={post.title} url={window.location.href} />
            </div>

            {/* Cover Image - Optimized Size */}
            {post.coverImage && (
              <div className="relative w-full max-w-3xl mt-8">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent rounded-xl"></div>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/10] rounded-xl border border-border/50 object-cover shadow-lg hover:shadow-xl transition-shadow duration-500"
                />
              </div>
            )}
          </div>
        </div>
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* İçindekiler - Modern Sidebar */}
            {tableOfContents.length > 2 && (
              <div className="lg:col-span-1">
                <div className="sticky top-28">
                  <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <List className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground">İçindekiler</h3>
                    </div>
                    <nav className="space-y-3">
                      {tableOfContents.map((heading, index) => (
                        <a
                          key={index}
                          href={`#${heading.id}`}
                          className={`block text-sm hover:text-primary transition-all duration-300 hover:translate-x-1 ${heading.level === 2
                            ? 'font-semibold text-foreground py-2 px-3 rounded-lg hover:bg-primary/5'
                            : 'ml-6 text-muted-foreground py-1 px-2 rounded hover:bg-muted/50'
                            }`}
                        >
                          {heading.title}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}

            {/* Ana İçerik - Enhanced Typography */}
            <div className={tableOfContents.length > 2 ? "lg:col-span-3" : "lg:col-span-4"}>
              <article className="prose prose-xl dark:prose-invert mx-auto max-w-none">
                <div
                  className="content-prose space-y-8 [&_h2]:text-3xl md:[&_h2]:text-4xl [&_h2]:font-extrabold [&_h2]:mt-16 [&_h2]:mb-8 [&_h2]:!text-foreground [&_h2]:scroll-mt-28 [&_h2]:relative [&_h2]:before:absolute [&_h2]:before:left-0 [&_h2]:before:top-0 [&_h2]:before:h-1 [&_h2]:before:w-12 [&_h2]:before:bg-gradient-to-r [&_h2]:before:from-primary [&_h2]:before:to-primary/60 [&_h2]:before:rounded-full [&_h2]:pt-4 [&_h3]:text-2xl md:[&_h3]:text-3xl [&_h3]:font-bold [&_h3]:mt-12 [&_h3]:mb-6 [&_h3]:!text-foreground [&_h3]:scroll-mt-28 [&_p]:text-lg md:[&_p]:text-xl [&_p]:leading-relaxed [&_p]:mb-8 [&_p]:!text-foreground/90 [&_ul]:mb-8 [&_ul]:space-y-3 [&_li]:mb-3 [&_li]:text-lg md:[&_li]:text-xl [&_li]:!text-foreground/90 [&_li]:relative [&_li]:pl-2 [&_strong]:font-bold [&_strong]:!text-foreground [&_a]:text-primary [&_a]:no-underline [&_a]:relative [&_a]:font-semibold hover:[&_a]:text-primary/80 [&_a]:transition-colors [&_a]:before:absolute [&_a]:before:bottom-0 [&_a]:before:left-0 [&_a]:before:w-0 [&_a]:before:h-0.5 [&_a]:before:bg-primary [&_a]:before:transition-all hover:[&_a]:before:w-full [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-gradient-to-r [&_blockquote]:from-primary/5 [&_blockquote]:to-transparent [&_blockquote]:p-6 [&_blockquote]:rounded-r-xl [&_blockquote]:not-italic [&_blockquote]:shadow-sm [&_code]:bg-muted [&_code]:px-3 [&_code]:py-1 [&_code]:rounded-md [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-muted [&_pre]:p-6 [&_pre]:rounded-xl [&_pre]:shadow-inner [&_img]:rounded-xl [&_img]:shadow-lg [&_img]:border [&_img]:border-border/50"
                  dangerouslySetInnerHTML={{
                    __html: contentWithIds
                  }}
                />
              </article>

              {/* Enhanced Author Section */}
              <div className="mt-20">
                <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-2xl"></div>
                  <div className="relative flex items-start gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-lg"></div>
                      <Avatar className="relative h-20 w-20 border-2 border-primary/20 shadow-lg">
                        <AvatarImage src="/logo-transparent.png" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">AR</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl mb-3 text-foreground">Artiklo Hukuk Ekibi</h4>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Hukuki belgeleri anlaşılır hale getiren yapay zeka destekli platform. Karmaşık yasal metinleri
                        sade Türkçe ile açıklayarak vatandaşların hukuki haklarını daha iyi anlamalarına yardımcı oluyoruz.
                      </p>
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <a
                          href="https://artiklo.com"
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-full transition-colors"
                        >
                          Artiklo'yu Keşfet
                          <ArrowRight className="h-4 w-4" />
                        </a>
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full"></span>
                          {blogPosts.length} rehber yazısı
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Related Articles */}
              <div className="mt-20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px bg-gradient-to-r from-primary/60 to-transparent flex-1"></div>
                  <h3 className="text-2xl font-bold text-foreground">İlgili Rehberler</h3>
                  <div className="h-px bg-gradient-to-l from-primary/60 to-transparent flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(() => {
                    // Akıllı ilgili makale seçimi: tag bazlı eşleştirme
                    const relatedPosts = blogPosts
                      .filter(relatedPost => relatedPost.id !== post.id)
                      .map(relatedPost => {
                        // Tag eşleşme skorunu hesapla
                        const commonTags = post.tags?.filter(tag =>
                          relatedPost.tags?.includes(tag)
                        ).length || 0;
                        return { ...relatedPost, score: commonTags };
                      })
                      .sort((a, b) => b.score - a.score) // En yüksek skordan düşüğe
                      .slice(0, 2);

                    return relatedPosts.map(relatedPost => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.id}`}
                        className="group block h-full"
                      >
                        <div className="h-full bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]">
                          <div className="flex flex-col h-full">
                            <h4 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-3 flex-grow">
                              {relatedPost.title}
                            </h4>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                              {relatedPost.summary}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{calculateReadingTime(relatedPost.content)} dk</span>
                                </div>
                                <span>•</span>
                                <span>{format(new Date(relatedPost.publishedAt), "d MMM yyyy", { locale: tr })}</span>
                              </div>
                              <div className="inline-flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ));
                  })()}
                </div>

                {/* SEO Enhancement: Keywords Section */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border/30">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full"></span>
                      Bu Rehberdeki Anahtar Konular
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reading Progress Enhancement */}
                <div className="mt-12 text-center">
                  <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Bu rehberi {calculateReadingTime(post.content)} dakikada okudunuz</span>
                  </div>
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



// Geliştirilmiş head yönetimi: title/meta/canonical, FAQ JSON-LD, Article Schema, Open Graph
const HeadMeta = ({ post }: { post: BlogPost }) => {
  useEffect(() => {
    const prevTitle = document.title;
    const title = post.seoTitle || post.title;
    const currentUrl = window.location.href;
    document.title = title;

    // Mevcut meta etiketleri temizle ve yeni ekle
    const metaTagsToRemove = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="author"], meta[name="article:"], meta[name="description"]');
    metaTagsToRemove.forEach(tag => tag.remove());

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    if (post.metaDescription) metaDesc.setAttribute('content', post.metaDescription);

    // Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: post.metaDescription || post.summary },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'article' },
      { property: 'og:locale', content: 'tr_TR' },
      { property: 'og:site_name', content: 'Artiklo Blog' },
      ...(post.coverImage ? [{ property: 'og:image', content: new URL(post.coverImage, window.location.origin).href }] : []),
      { property: 'article:published_time', content: new Date(post.publishedAt).toISOString() },
      { property: 'article:author', content: 'Artiklo Hukuk Ekibi' },
      { property: 'article:section', content: 'Hukuk Rehberleri' },
      ...(post.tags ? post.tags.map(tag => ({ property: 'article:tag', content: tag })) : [])
    ];

    ogTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', tag.property);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    });

    // Twitter Card meta tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: post.metaDescription || post.summary },
      ...(post.coverImage ? [{ name: 'twitter:image', content: new URL(post.coverImage, window.location.origin).href }] : [])
    ];

    twitterTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', tag.name);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    });

    // Author meta
    const authorMeta = document.createElement('meta');
    authorMeta.setAttribute('name', 'author');
    authorMeta.setAttribute('content', 'Artiklo Hukuk Ekibi');
    document.head.appendChild(authorMeta);

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    if (post.canonical) linkCanonical.setAttribute('href', post.canonical);

    // JSON-LD Scripts temizle
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Article JSON-LD Schema
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': title,
      'description': post.metaDescription || post.summary,
      'image': post.coverImage ? new URL(post.coverImage, window.location.origin).href : undefined,
      'author': {
        '@type': 'Organization',
        'name': 'Artiklo Hukuk Ekibi',
        'url': 'https://artiklo.com'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Artiklo',
        'url': 'https://artiklo.com',
        'logo': {
          '@type': 'ImageObject',
          'url': new URL('/logo-transparent.png', window.location.origin).href
        }
      },
      'datePublished': new Date(post.publishedAt).toISOString(),
      'dateModified': new Date(post.publishedAt).toISOString(),
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': currentUrl
      },
      'url': currentUrl,
      'articleSection': 'Hukuk Rehberleri',
      'keywords': post.tags?.join(', ') || '',
      'inLanguage': 'tr-TR'
    };

    const articleScript = document.createElement('script');
    articleScript.type = 'application/ld+json';
    articleScript.text = JSON.stringify(articleSchema);
    document.head.appendChild(articleScript);

    // FAQ JSON-LD (varsa)
    if (post.faq && post.faq.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': post.faq.map(q => ({
          '@type': 'Question',
          'name': q.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': q.answer
          }
        }))
      };

      const faqScript = document.createElement('script');
      faqScript.type = 'application/ld+json';
      faqScript.text = JSON.stringify(faqSchema);
      document.head.appendChild(faqScript);
    }

    // BreadcrumbList JSON-LD
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Ana Sayfa',
          'item': new URL('/', window.location.origin).href
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Blog',
          'item': new URL('/blog', window.location.origin).href
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': post.title,
          'item': currentUrl
        }
      ]
    };

    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.title = prevTitle;
      // Cleanup - sonraki sayfa için temizleme
      const scriptsToRemove = document.querySelectorAll('script[type="application/ld+json"]');
      scriptsToRemove.forEach(script => script.remove());

      const metaTagsToRemove = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="author"], meta[name="article:"]');
      metaTagsToRemove.forEach(tag => tag.remove());
    };
  }, [post]);

  return null;
};