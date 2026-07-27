const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

export default function remarkMermaid() {
  return (tree) => {
    const visit = (node) => {
      if (!node || typeof node !== 'object') return;

      if (node.type === 'code' && node.lang === 'mermaid') {
        node.type = 'html';
        node.value = `<pre class="mermaid">${escapeHtml(node.value)}</pre>`;
        delete node.lang;
        delete node.meta;
      }

      if (node.type === 'code' && node.lang === 'gradle') {
        node.lang = 'groovy';
      }

      if (
        node.type === 'link' &&
        typeof node.url === 'string' &&
        !node.url.startsWith('/') &&
        /\.pub\.(?:md|mdx|ipynb)(?=$|[?#])/.test(node.url)
      ) {
        node.url = `../${node.url.replace(/^\.\//, '')}`.replace(
          /\.pub\.(?:md|mdx|ipynb)(?=$|[?#])/,
          '.pub/',
        );
      }

      if (Array.isArray(node.children)) {
        node.children.forEach(visit);
      }
    };

    visit(tree);
  };
}
