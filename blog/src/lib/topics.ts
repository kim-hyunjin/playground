export interface TopicSource {
  id: string;
}

export interface TopicNode {
  path: string;
  segment: string;
  name: string;
  count: number;
  directCount: number;
  children: TopicNode[];
}

export interface TopicBreadcrumb {
  path: string;
  name: string;
}

const TOPIC_LABELS: Record<string, string> = {
  ai: 'AI',
  algorithms: 'Algorithms',
  backend: 'Backend',
  blockchain: 'Blockchain',
  'design-architecture': 'Design & Architecture',
  frontend: 'Frontend',
  language: 'Language',
  mobile: 'Mobile',
  security: 'Security',
  'ai/deeplearning-from-scratch': 'Deep Learning from Scratch',
  'ai/deeplearning-master': 'Deep Learning Master',
  'backend/backend-engineering': 'Backend Engineering',
  'backend/backend-engineering/asynchronous-processing': 'Asynchronous Processing',
  'backend/backend-engineering/communications': 'Communications',
  'backend/backend-engineering/messaging-streaming': 'Messaging & Streaming',
  'backend/database': 'Database',
  'backend/database/fundamentals': 'Fundamentals',
  'backend/database/indexes-storage': 'Indexes & Storage',
  'backend/database/replication-distribution': 'Replication & Distribution',
  'backend/database/sql-tuning': 'SQL Tuning',
  'backend/database/transactions-concurrency': 'Transactions & Concurrency',
  'backend/distributed-systems': 'Distributed Systems',
  'backend/distributed-systems/search-data': 'Search & Data',
  'backend/rust': 'Rust',
  'backend/rust/board-api': 'Board API',
  'design-architecture/design-patterns-refactoring': 'Design Patterns & Refactoring',
  'frontend/react': 'React',
  'frontend/vue': 'Vue',
  'language/java': 'Java',
  'language/kotlin': 'Kotlin',
  'mobile/android': 'Android',
  'mobile/ios': 'iOS',
};

const TOPIC_ORDER = [
  'ai',
  'algorithms',
  'backend',
  'blockchain',
  'design-architecture',
  'frontend',
  'language',
  'mobile',
  'security',
];

function titleCase(segment: string) {
  return segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase('ko') + word.slice(1))
    .join(' ');
}

export function topicLabel(path: string) {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  return TOPIC_LABELS[normalized] ?? titleCase(normalized.split('/').at(-1) ?? normalized);
}

export function topicSegmentsFromId(id: string) {
  const normalized = id
    .replaceAll('\\', '/')
    .replace(/^\/+/, '')
    .replace(/\.(md|mdx)$/, '');
  return normalized.split('/').filter(Boolean).slice(0, -1);
}

export function topicPathFromId(id: string) {
  return topicSegmentsFromId(id).join('/');
}

export function topicBreadcrumbsFromPath(path: string): TopicBreadcrumb[] {
  const segments = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  return segments.map((_, index) => {
    const currentPath = segments.slice(0, index + 1).join('/');
    return { path: currentPath, name: topicLabel(currentPath) };
  });
}

function compareTopics(a: TopicNode, b: TopicNode) {
  const aOrder = TOPIC_ORDER.indexOf(a.path);
  const bOrder = TOPIC_ORDER.indexOf(b.path);
  if (aOrder !== -1 || bOrder !== -1) {
    if (aOrder === -1) return 1;
    if (bOrder === -1) return -1;
    return aOrder - bOrder;
  }
  return a.name.localeCompare(b.name, 'ko');
}

export function buildTopicTree(entries: readonly TopicSource[]) {
  const roots: TopicNode[] = [];
  const nodes = new Map<string, TopicNode>();

  for (const entry of entries) {
    const segments = topicSegmentsFromId(entry.id);
    let siblings = roots;

    segments.forEach((segment, index) => {
      const path = segments.slice(0, index + 1).join('/');
      let node = nodes.get(path);
      if (!node) {
        node = {
          path,
          segment,
          name: topicLabel(path),
          count: 0,
          directCount: 0,
          children: [],
        };
        nodes.set(path, node);
        siblings.push(node);
      }
      node.count += 1;
      if (index === segments.length - 1) node.directCount += 1;
      siblings = node.children;
    });
  }

  const sortNodes = (items: TopicNode[]) => {
    items.sort(compareTopics);
    items.forEach((item) => sortNodes(item.children));
  };
  sortNodes(roots);
  return roots;
}

export function flattenTopicTree(topics: readonly TopicNode[]): TopicNode[] {
  return topics.flatMap((topic) => [topic, ...flattenTopicTree(topic.children)]);
}
