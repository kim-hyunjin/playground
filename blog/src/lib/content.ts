import { getCollection, type CollectionEntry } from 'astro:content';
import { slugifySegment, withBase } from './url';
import {
  buildTopicTree,
  topicBreadcrumbsFromPath,
  topicPathFromId,
  type TopicNode,
} from './topics';

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
  return topicUrl(slugifySegment(category), page);
}

export function topicUrl(path: string, page?: number) {
  const normalized = path
    .split('/')
    .filter(Boolean)
    .map(slugifySegment)
    .join('/');
  const suffix = page && page > 1 ? `/page/${page}` : '';
  return withBase(`categories/${normalized}${suffix}/`);
}

export function tagUrl(tag: string, page?: number) {
  const suffix = page && page > 1 ? `/${page}` : '';
  return withBase(`tags/${tagSlug(tag)}${suffix}/`);
}

export function tagSlug(tag: string) {
  const slug = slugifySegment(tag);
  return slug === 'index' ? 'index-tag' : slug;
}

export function collectCategories(entries: BlogEntry[]) {
  return buildTopicTree(entries).map(({ name, count, path }) => ({
    name,
    count,
    slug: path,
  }));
}

export function collectTopics(entries: BlogEntry[]): TopicNode[] {
  return buildTopicTree(entries);
}

export function entryTopicPath(entry: BlogEntry) {
  return topicPathFromId(entry.id);
}

export function entryTopicBreadcrumbs(entry: BlogEntry) {
  return topicBreadcrumbsFromPath(entryTopicPath(entry)).map((item) => ({
    ...item,
    url: topicUrl(item.path),
  }));
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
