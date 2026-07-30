import type { PhrasingContent, Root, Text } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const cjkStrongPattern = /\*\*([^*\n]+[)\]}])\*\*(?=[가-힣])/g;

function splitCjkStrongText(node: Text): PhrasingContent[] {
  const matches = [...node.value.matchAll(cjkStrongPattern)];
  if (matches.length === 0) return [node];

  const children: PhrasingContent[] = [];
  let cursor = 0;

  for (const match of matches) {
    const index = match.index ?? 0;
    if (index > cursor) {
      children.push({ type: 'text', value: node.value.slice(cursor, index) });
    }

    children.push({
      type: 'strong',
      children: [{ type: 'text', value: match[1] }],
    });
    cursor = index + match[0].length;
  }

  if (cursor < node.value.length) {
    children.push({ type: 'text', value: node.value.slice(cursor) });
  }

  return children;
}

export function transformCjkStrong(tree: Root): void {
  visit(tree, 'text', (node, index, parent) => {
    if (index === undefined || parent === undefined) return;

    const replacement = splitCjkStrongText(node);
    if (replacement.length === 1 && replacement[0] === node) return;

    parent.children.splice(index, 1, ...replacement);
    return index + replacement.length;
  });
}

const remarkCjkStrong: Plugin<[], Root> = () => {
  return transformCjkStrong;
};

export default remarkCjkStrong;
