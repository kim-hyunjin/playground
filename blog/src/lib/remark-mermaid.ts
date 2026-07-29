import type { Html, Root } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const remarkMermaid: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mermaid' || index === undefined || parent === undefined) return;

      const html: Html = {
        type: 'html',
        value: `<pre class="mermaid">${escapeHtml(node.value)}</pre>`,
      };
      parent.children[index] = html;
    });

    visit(tree, 'link', (node) => {
      if (
        !node.url.startsWith('/') &&
        /\.pub\.(?:md|mdx|ipynb)(?=$|[?#])/.test(node.url)
      ) {
        node.url = `../${node.url.replace(/^\.\//, '')}`.replace(
          /\.pub\.(?:md|mdx|ipynb)(?=$|[?#])/,
          '.pub/',
        );
      }
    });
  };
};

export default remarkMermaid;
