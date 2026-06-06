import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, RotateCcw, Plus, Trophy, Frown, CheckCircle2, XCircle } from 'lucide-react';
import api from '../api/axios';

interface ResultData {
  id: number;
  quizId: number;
  score: number;
  total: number;
  wrongQuestions: {
    id: number;
    body: string;
    options: string[];
    answer: number;
    userAnswer: number;
    explanation: string;
  }[];
}

const Result = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/quiz/result/${resultId}`);
        setResult(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || '결과를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    if (resultId) fetchResult();
  }, [resultId]);

  if (isLoading) return <div className="nq-container items-center justify-center"><Loader2 className="animate-spin text-[var(--accent)]" size={48} /></div>;
  if (error) return <div className="nq-container items-center justify-center text-red-500">{error}</div>;
  if (!result) return null;

  const scorePercent = Math.round((result.score / result.total) * 100);

  return (
    <div className="nq-container max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] mb-6">
          {scorePercent >= 80 ? <Trophy size={48} /> : <Frown size={48} />}
        </div>
        <h1 className="text-4xl font-bold mb-2">
          {result.score} / {result.total}
        </h1>
        <p className="text-xl text-[var(--text)]">정답률 {scorePercent}%</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Link to={`/quiz/${result.quizId}`} className="nq-button nq-button-secondary py-4 flex items-center justify-center gap-2">
          <RotateCcw size={20} />
          다시 풀기
        </Link>
        <Link to="/" className="nq-button nq-button-primary py-4 flex items-center justify-center gap-2">
          <Plus size={20} />
          새로운 퀴즈 만들기
        </Link>
      </div>

      {result.wrongQuestions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">오답 노트</h2>
          <div className="flex flex-col gap-6">
            {result.wrongQuestions.map((q, idx) => (
              <div key={idx} className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                <p className="font-semibold text-lg mb-4">{q.body}</p>
                <div className="grid gap-2 mb-4">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border flex items-center gap-2 text-sm ${
                        i === q.answer
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : i === q.userAnswer
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-[var(--border)]'
                      }`}
                    >
                      {i === q.answer && <CheckCircle2 size={16} />}
                      {i === q.userAnswer && i !== q.answer && <XCircle size={16} />}
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                  <p className="text-sm font-bold text-gray-700 mb-1">해설</p>
                  <p className="text-sm text-gray-600">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
