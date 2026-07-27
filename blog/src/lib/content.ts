import { getCollection, type CollectionEntry } from 'astro:content';
import { slugifySegment, withBase } from './url';

export type BlogEntry = CollectionEntry<'posts'> | CollectionEntry<'notebooks'>;

export async function getPublishedPosts(): Promise<BlogEntry[]> {
  const now = Date.now();
  const entries = [
    ...(await getCollection('posts')),
    ...(await getCollection('notebooks')),
  ].filter((entry) => !entry.data.draft && entry.data.date.getTime() <= now);

  return entries.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id),
  );
}

export function entrySlug(entry: BlogEntry) {
  return entry.id.replace(/\.(md|mdx)$/, '').replace(/^\/+/, '');
}

export function entryUrl(entry: BlogEntry) {
  return withBase(`${entrySlug(entry)}/`);
}

export function categoryUrl(category: string, page?: number) {
  const suffix = page && page > 1 ? `/${page}` : '';
  return withBase(`categories/${slugifySegment(category)}${suffix}/`);
}

export function tagUrl(tag: string, page?: number) {
  const suffix = page && page > 1 ? `/${page}` : '';
  return withBase(`tags/${tagSlug(tag)}${suffix}/`);
}

export function tagSlug(tag: string) {
  const slug = slugifySegment(tag);
  return slug === 'index' ? 'index-tag' : slug;
}

export function readingMinutes(entry: BlogEntry) {
  const text = ('body' in entry ? entry.body : '') ?? '';
  const words = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 260));
}

export function collectCategories(entries: BlogEntry[]) {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.data.category, (counts.get(entry.data.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, slug: slugifySegment(name) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}

export function collectTags(entries: BlogEntry[]) {
  const tags = new Map<string, { name: string; count: number; slug: string }>();
  for (const entry of entries) {
    const entrySlugs = new Set<string>();
    for (const tag of entry.data.tags) {
      const slug = tagSlug(tag);
      if (entrySlugs.has(slug)) continue;
      entrySlugs.add(slug);
      const current = tags.get(slug);
      if (current) {
        current.count += 1;
      } else {
        tags.set(slug, { name: tag, count: 1, slug });
      }
    }
  }
  return [...tags.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ko'));
}
