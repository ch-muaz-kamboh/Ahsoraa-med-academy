import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo-constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/portal/', '/admin/', '/staff/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/portal/', '/admin/', '/staff/', '/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/portal/', '/admin/', '/staff/', '/api/'],
      },
      // AI Crawlers and Search Engines
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Applebot'],
        allow: '/',
        disallow: ['/portal/', '/admin/', '/staff/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
