import { useState, useCallback } from 'react';
import Header from './components/Header';
import IndexBox from './components/IndexBox';
import SummaryTable from './components/SummaryTable';
import ContentSection from './components/ContentSection';
import WikiList from './components/WikiList';
import { WikiArticle } from './data/wikiContent';

type ViewState = 'list' | 'article';

export default function App() {
  const [view, setView] = useState<ViewState>('list');
  const [currentArticle, setCurrentArticle] = useState<WikiArticle | null>(null);

  const handleSelectArticle = useCallback((article: WikiArticle) => {
    setCurrentArticle(article);
    setView('article');
  }, []);

  const handleBackToList = useCallback(() => {
    setView('list');
    setCurrentArticle(null);
  }, []);

  if (view === 'list') {
    return (
      <>
        <Header />
        <WikiList onSelect={handleSelectArticle} />
      </>
    );
  }

  if (!currentArticle) return null;

  return (
    <>
      <Header title={currentArticle.title} onBack={handleBackToList} />
      <article className="p-3">
        <div className="flex justify-between gap-4 mobile:flex-col-reverse">
          <IndexBox sections={currentArticle.sections} />
          <SummaryTable
            title={currentArticle.title}
            subtitle={currentArticle.subtitle}
            image={currentArticle.image}
            summaryData={currentArticle.summary}
          />
        </div>
        <div className="relative overflow-hidden pb-8">
          <ContentSection sections={currentArticle.sections} />
        </div>
      </article>
    </>
  );
}
