module.exports = {
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'all',
  singleQuote: true,
  semi: true,
  useTabs: false,

  importOrder: [
    'react',
    '<THIRD_PARTY_MODULES>',
    'api(.*)$',
    'components(.*)$',
    'hooks(.*)$',
    'utils(.*)$',
    'types(.*)$',
    'assets(.*)$',
    '^../(.*)$',
    '^./(.*)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
