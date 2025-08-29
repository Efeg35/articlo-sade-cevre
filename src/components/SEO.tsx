import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    noIndex = false
}) => {
    const location = useLocation();

    // Default values
    const defaultTitle = 'Artiklo - Hukuki Belgeleri Anında Sadeleştirin';
    const defaultDescription = 'Karmaşık hukuki belgeleri yapay zeka teknolojisi ile anında anlaşılır Türkçeye çeviren platform. Kira sözleşmeleri, mahkeme kararları ve tebligatları kolayca anlayın.';
    const defaultKeywords = 'hukuki belge analizi, yapay zeka, belge sadeleştirme, kira sözleşmesi, mahkeme kararı, tebligat, hukuki danışmanlık, türkçe çeviri';
    const defaultImage = '/og-image.png';
    const siteUrl = 'https://artiklo.com';

    // Construct final values
    const finalTitle = title ? `${title} | Artiklo` : defaultTitle;
    const finalDescription = description || defaultDescription;
    const finalKeywords = keywords || defaultKeywords;
    const finalImage = image || defaultImage;
    const finalUrl = url || `${siteUrl}${location.pathname}`;
    const finalImageUrl = finalImage.startsWith('http') ? finalImage : `${siteUrl}${finalImage}`;

    useEffect(() => {
        // Update title
        document.title = finalTitle;

        // Helper function to update or create meta tags
        const updateMeta = (name: string, content: string, property?: boolean) => {
            const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let element = document.querySelector(selector) as HTMLMetaElement;

            if (!element) {
                element = document.createElement('meta');
                if (property) {
                    element.setAttribute('property', name);
                } else {
                    element.setAttribute('name', name);
                }
                document.head.appendChild(element);
            }

            element.setAttribute('content', content);
        };

        // Helper function to update or create link tags
        const updateLink = (rel: string, href: string) => {
            let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

            if (!element) {
                element = document.createElement('link');
                element.setAttribute('rel', rel);
                document.head.appendChild(element);
            }

            element.setAttribute('href', href);
        };

        // Basic meta tags
        updateMeta('description', finalDescription);
        updateMeta('keywords', finalKeywords);
        updateMeta('author', author || 'Artiklo');
        updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

        // Open Graph tags
        updateMeta('og:title', finalTitle, true);
        updateMeta('og:description', finalDescription, true);
        updateMeta('og:image', finalImageUrl, true);
        updateMeta('og:url', finalUrl, true);
        updateMeta('og:type', type, true);
        updateMeta('og:site_name', 'Artiklo', true);
        updateMeta('og:locale', 'tr_TR', true);

        // Twitter Card tags
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:site', '@artiklo');
        updateMeta('twitter:creator', '@artiklo');
        updateMeta('twitter:title', finalTitle);
        updateMeta('twitter:description', finalDescription);
        updateMeta('twitter:image', finalImageUrl);

        // Additional meta tags
        updateMeta('theme-color', '#2563eb');
        updateMeta('msapplication-TileColor', '#2563eb');
        updateMeta('apple-mobile-web-app-capable', 'yes');
        updateMeta('apple-mobile-web-app-status-bar-style', 'default');
        updateMeta('apple-mobile-web-app-title', 'Artiklo');

        // Article specific tags
        if (type === 'article') {
            if (publishedTime) {
                updateMeta('article:published_time', publishedTime, true);
            }
            if (modifiedTime) {
                updateMeta('article:modified_time', modifiedTime, true);
            }
            updateMeta('article:author', author || 'Artiklo', true);
            updateMeta('article:section', 'Hukuk', true);
        }

        // Canonical URL
        updateLink('canonical', finalUrl);

        // Alternative languages (if needed in the future)
        updateLink('alternate', `${finalUrl}?lang=en`);

        // DNS prefetch for performance
        const dnsPrefetchDomains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'www.google-analytics.com'
        ];

        dnsPrefetchDomains.forEach(domain => {
            if (!document.querySelector(`link[rel="dns-prefetch"][href="//${domain}"]`)) {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = `//${domain}`;
                document.head.appendChild(link);
            }
        });

        // JSON-LD Schema.org structured data
        const structuredData = {
            "@context": "https://schema.org",
            "@type": type === 'article' ? 'Article' : 'WebSite',
            "name": finalTitle,
            "description": finalDescription,
            "url": finalUrl,
            "image": finalImageUrl,
            "author": {
                "@type": "Organization",
                "name": "Artiklo"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Artiklo",
                "url": siteUrl,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${siteUrl}/logo-512.png`
                }
            },
            "inLanguage": "tr-TR",
            "copyrightHolder": {
                "@type": "Organization",
                "name": "Artiklo"
            }
        };

        // Add organization specific data for website
        if (type === 'website') {
            Object.assign(structuredData, {
                "@type": "Organization",
                "name": "Artiklo",
                "url": siteUrl,
                "logo": `${siteUrl}/logo-512.png`,
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+90-xxx-xxx-xx-xx",
                    "contactType": "customer support",
                    "availableLanguage": "Turkish"
                },
                "sameAs": [
                    "https://linkedin.com/company/artiklo",
                    "https://twitter.com/artiklo"
                ],
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "TR",
                    "addressLocality": "İstanbul"
                }
            });
        }

        // Article specific structured data
        if (type === 'article' && publishedTime) {
            Object.assign(structuredData, {
                "datePublished": publishedTime,
                "dateModified": modifiedTime || publishedTime,
                "headline": finalTitle,
                "articleSection": "Hukuk",
                "wordCount": description?.length || 200
            });
        }

        // Update JSON-LD script
        let jsonLdScript = document.querySelector('#structured-data') as HTMLScriptElement;
        if (!jsonLdScript) {
            jsonLdScript = document.createElement('script');
            jsonLdScript.id = 'structured-data';
            jsonLdScript.type = 'application/ld+json';
            document.head.appendChild(jsonLdScript);
        }
        jsonLdScript.textContent = JSON.stringify(structuredData, null, 2);

    }, [finalTitle, finalDescription, finalKeywords, finalImage, finalUrl, type, author, publishedTime, modifiedTime, noIndex]);

    return null; // This component doesn't render anything
};

export default SEO;