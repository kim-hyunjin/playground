import type { ShikiTransformer } from '@shikijs/types';
import type { Element } from 'hast';

const LANGUAGE_LABELS: Readonly<Record<string, string>> = {
  bash: 'Bash',
  c: 'C',
  cpp: 'C++',
  css: 'CSS',
  erlang: 'Erlang',
  gradle: 'Gradle',
  groovy: 'Groovy',
  ini: 'INI',
  java: 'Java',
  javascript: 'JavaScript',
  jinja: 'Jinja',
  json: 'JSON',
  properties: 'Properties',
  protobuf: 'Protocol Buffers',
  python: 'Python',
  rust: 'Rust',
  scss: 'SCSS',
  solidity: 'Solidity',
  sql: 'SQL',
  swift: 'Swift',
  text: 'Text',
  toml: 'TOML',
  typescript: 'TypeScript',
  xml: 'XML',
};

export function codeLanguageLabel(language: string): string {
  return LANGUAGE_LABELS[language] ?? language;
}

export function addCodeLanguageLabel(node: Element, language: string): void {
  if (!language || language === 'plaintext') return;

  const label = codeLanguageLabel(language);
  node.children.unshift({
    type: 'element',
    tagName: 'span',
    properties: {
      ariaLabel: `코드 언어: ${label}`,
      className: ['code-language'],
      dataPagefindIgnore: '',
    },
    children: [{ type: 'text', value: label }],
  });
}

const codeLanguageLabelTransformer = {
  name: 'code-language-label',
  pre(node) {
    const language = String(this.options.lang ?? '');
    addCodeLanguageLabel(node, language);
  },
} satisfies ShikiTransformer;

export default codeLanguageLabelTransformer;
