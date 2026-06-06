import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Share2, Play } from 'lucide-react';
import api from '../api/axios';

interface SharedQuiz {
  id: number;
  quizId: string;
  title: string;
  questionCount: number;
}

const Share = () => {
  const { shareToken } = useParams();
  const [quiz, setQuiz] = useState<SharedQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await api.get(`/share/${shareToken}`);
        setQuiz(res.data);
      } catch (err) {
        setError('유효하지 않거나 만료된 공유 링크입니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchShared();
  }, [shareToken]);

  if (isLoading) return <div className="nq-container items-center justify-center"><Loader2 className="animate-spin text-[var(--accent)]" size={48} /></div>;
  if (error) return <div className="nq-container items-center justify-center text-red-500">{error}</div>;
  if (!quiz) return null;

  return (
    <div className="nq-container items-center justify-center py-20 text-center">
      <div className="w-full max-w-lg border border-[var(--border)] rounded-2xl p-12 bg-[var(--bg)] shadow-sm">
        <div className="w-20 h-20 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center mx-auto mb-8">
          <Share2 size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
        <p className="text-[var(--text)] mb-8">누군가가 당신에게 복습 퀴즈를 보냈습니다.<br />{quiz.questionCount}개의 문제가 준비되어 있습니다.</p>
        
        <Link to={`/quiz/${quiz.quizId}`} className="nq-button nq-button-primary w-full py-4 flex items-center justify-center gap-2 text-lg">
          <Play size={20} />
          퀴즈 시작하기
        </Link>
        
        <p className="mt-8 text-sm text-[var(--text)]">
          나만의 퀴즈를 만들고 싶다면? <Link to="/signup" className="text-[var(--accent)] hover:underline">회원가입하기</Link>
        </p>
      </div>
    </div>
  );
};

export default Share;
