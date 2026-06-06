import { allWikis, WikiArticle } from '../data/wikiContent';

interface WikiListProps {
  onSelect: (article: WikiArticle) => void;
}

export default function WikiList({ onSelect }: WikiListProps) {
  return (
    <div className="p-4 bg-[#f8f9fa] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 border-b-2 border-primary pb-2">
        위키 문서 목록
      </h1>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {allWikis.map((wiki) => (
          <div
            key={wiki.id}
            onClick={() => onSelect(wiki)}
            className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-primary group"
          >
            <h2 className="text-2xl font-semibold text-blue-800 group-hover:underline">
              {wiki.title}
            </h2>
            {wiki.subtitle && (
              <p className="text-gray-500 text-sm mb-2">{wiki.subtitle}</p>
            )}
            <p className="text-gray-700 mt-2 line-clamp-2 italic">
              {wiki.sections[0]?.content.substring(0, 100)}...
            </p>
          </div>
        ))}
      </div>
      <div className="mt-12 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
        💡 <code>src/data/articles/</code> 폴더에 새로운 .tsx 파일을 추가하고 <code>src/data/wikiContent.ts</code>에 등록하면 새로운 위키 문서가 리스트에 나타납니다.
      </div>
    </div>
  );
}
