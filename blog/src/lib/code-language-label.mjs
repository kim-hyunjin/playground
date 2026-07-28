const LANGUAGE_LABELS = {
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

export function codeLanguageLabel(language) {
  return LANGUAGE_LABELS[language] ?? language;
}

export default {
  name: 'code-language-label',
  pre(node) {
    const language = String(this.options.lang ?? '');
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
  },
};
