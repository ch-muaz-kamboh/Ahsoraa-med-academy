import type { Metadata } from 'next';
import NewsArticlePage, { generateMetadata as baseGenerateMetadata } from '../../imat-news-and-updates/[slug]/page';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return baseGenerateMetadata(props);
}

export default NewsArticlePage;
