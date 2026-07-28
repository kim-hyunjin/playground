const cjkStrongPattern = /\*\*([^*\n]+[)\]}])\*\*(?=[가-힣])/g;

function splitCjkStrongText(node) {
  const matches = [...node.value.matchAll(cjkStrongPattern)];
  if (matches.length === 0) return [node];

  const children = [];
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

export default function remarkCjkStrong() {
  return (tree) => {
    const visit = (node) => {
      if (!Array.isArray(node?.children)) return;

      node.children = node.children.flatMap((child) => {
        if (child?.type === 'text') return splitCjkStrongText(child);
        visit(child);
        return [child];
      });
    };

    visit(tree);
  };
}
