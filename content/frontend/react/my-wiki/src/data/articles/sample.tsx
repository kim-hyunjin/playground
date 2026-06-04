import { WikiArticle } from '../wikiContent';

export const sampleWiki: WikiArticle = {
  id: 'electron',
  title: 'Electron',
  subtitle: 'Desktop App Framework',
  summary: [
    { label: '개발자', value: 'GitHub' },
    { label: '최초 출시', value: '2013년 7월 15일' },
    { label: '사용 언어', value: 'C++, JavaScript, HTML, CSS' },
    { label: '기반', value: 'Chromium, Node.js' },
  ],
  sections: [
    {
      id: '개요',
      title: '개요',
      content: 'Electron은 웹 기술(HTML, CSS, JS)을 사용하여 데스크톱 애플리케이션을 만들 수 있게 해주는 오픈 소스 프레임워크입니다.',
    },
    {
      id: '특징',
      title: '특징',
      content: `- 크로스 플랫폼 지원 (Windows, macOS, Linux)
- 웹 기술 활용 가능
- Node.js API 직접 호출 가능`,
    },
  ],
};
