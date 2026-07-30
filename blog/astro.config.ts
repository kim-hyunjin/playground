import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import { BASE_PATH, SITE_ORIGIN } from './scripts/config.ts';
import codeLanguageLabelTransformer from './src/lib/code-language-label.ts';
import remarkCjkStrong from './src/lib/remark-cjk-strong.ts';
import remarkMermaid from './src/lib/remark-mermaid.ts';

export default defineConfig({
  site: SITE_ORIGIN,
  base: BASE_PATH,
  output: 'static',
  build: {
    format: 'directory',
  },
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  markdown: {
    processor: unified({
      gfm: true,
      remarkPlugins: [remarkCjkStrong, remarkMermaid],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: {
              className: ['heading-anchor'],
              ariaLabel: '이 제목으로 연결',
            },
            content: [],
          },
        ],
      ],
    }),
    shikiConfig: {
      langAlias: {
        gradle: 'groovy',
      },
      transformers: [codeLanguageLabelTransformer],
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  vite: {
    build: {
      // Mermaid is lazy-loaded only on the seven posts that use it.
      chunkSizeWarningLimit: 700,
    },
  },
});
