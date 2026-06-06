import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

interface Question {
  id: number;
  body: string;
  options: string[];
  answer: number;
  explanation: string;
  orderNum: number;
}

interface WrongAnswer {
  id: number;
  question: Question;
  resolved: boolean;
}

const WrongAnswers = () => {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWrong = async () => {
      try {
        const res = await api.get('/my/wrong');
        setWrongAnswers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWrong();
  }, []);

  const handleResolve = async (id: number) => {
    try {
      await api.patch(`/my/wrong/${id}/resolve`);
      setWrongAnswers(wrongAnswers.filter(wa => wa.id !== id));
    } catch (err) {
      alert('처리에 실패했습니다.');
    }
  };

  if (isLoading) return <div className="nq-container items-center justify-center"><Loader2 className="animate-spin text-[var(--accent)]" size={48} /></div>;

  return (
    <div className="nq-container max-w-4xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">오답 노트</h1>
        <div className="flex items-center gap-2 text-[var(--accent)] bg-[var(--accent-bg)] px-4 py-2 rounded-full font-semibold">
          <AlertCircle size={20} />
          <span>{wrongAnswers.length}개의 오답</span>
        </div>
      </div>

      {wrongAnswers.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-[var(--border)]">
          <CheckCircle2 size={48} className="mx-auto text-green-300 mb-4" />
          <p className="text-[var(--text)]">모든 오답을 해결했습니다! 대단해요.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {wrongAnswers.map((wa) => (
            <div key={wa.id} className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <p className="font-semibold text-lg mb-4">{wa.question.body}</p>
              <div className="grid gap-2 mb-6">
                {wa.question.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-sm ${
                      i === wa.question.answer
                        ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                        : 'border-[var(--border)]'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg mb-6">
                <p className="text-sm font-bold text-gray-700 mb-1">해설</p>
                <p className="text-sm text-gray-600">{wa.question.explanation}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleResolve(wa.id)}
                  className="nq-button nq-button-secondary py-2 flex items-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  해결 완료
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WrongAnswers;
