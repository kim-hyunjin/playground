import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, entrySlug } from '../lib/content';
import { SITE_URL } from '../../scripts/config.ts';

export async function GET(context: APIContext) {
  const entries = await getPublishedPosts();
  return rss({
    title: 'hyunjin.log',
    description: 'Learn in public — multi-stack notes, side projects, and published blog posts.',
    site: context.site ?? SITE_URL,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: new URL(`${entrySlug(entry)}/`, SITE_URL).href,
      categories: [entry.data.category, ...entry.data.tags],
    })),
    customData: '<language>ko-kr</language>',
  });
}
