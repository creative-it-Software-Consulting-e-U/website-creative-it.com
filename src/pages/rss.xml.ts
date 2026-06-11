import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: 'creative-it Blog',
    description:
      'Articles about software development, AI, cloud architecture, and technology insights from creative-it',
    site: context.site ?? 'https://www.creative-it.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.brief,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id.replace(/\.md$/, '')}/`,
    })),
    customData: '<language>en</language>',
  });
}
