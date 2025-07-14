import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const staticPages = [
  '/',
  '/neden-artiklo',
  '/hakkimizda',
  '/blog',
  '/sss',
  '/kvkk-aydinlatma',
  '/kullanici-sozlesmesi'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const baseUrl = process.env.BASE_URL!;

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).send('Error fetching posts from Supabase');
    }

    let blogUrls = '';
    if (posts && Array.isArray(posts)) {
      blogUrls = posts.map(post =>
        `<url><loc>${baseUrl}/blog/${post.slug}</loc>${post.updated_at ? `<lastmod>${new Date(post.updated_at).toISOString()}</lastmod>` : ''}</url>`
      ).join('');
    }

    const staticUrls = staticPages.map(page =>
      `<url><loc>${baseUrl}${page}</loc></url>`
    ).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${blogUrls}
  </urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      return res.status(500).send(e.message);
    }
    return res.status(500).send('An unknown error occurred.');
  }
} 