import 'dotenv/config';
import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = process.env.PORT || 5174;

// Supabase ayarları (env'den alınmalı)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Ana sayfalar (kullanıcıya özel olmayanlar)
const staticPages = [
  "/",
  "/neden-artiklo",
  "/hakkimizda",
  "/blog",
  "/sss",
  "/kvkk-aydinlatma",
  "/kullanici-sozlesmesi"
];

app.get("/sitemap.xml", async (req, res) => {
  // Blog yazılarını Supabase'dan çek
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("slug, updated_at");

  let blogUrls = "";
  if (posts && Array.isArray(posts)) {
    blogUrls = posts.map(post =>
      `<url><loc>${process.env.BASE_URL}/blog/${post.slug}</loc>${post.updated_at ? `<lastmod>${new Date(post.updated_at).toISOString()}</lastmod>` : ""}</url>`
    ).join("");
  }

  const staticUrls = staticPages.map(page =>
    `<url><loc>${process.env.BASE_URL}${page}</loc></url>`
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
});

app.listen(port, () => {
  console.log(`Sitemap server running at http://localhost:${port}/sitemap.xml`);
}); 