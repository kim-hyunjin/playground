import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';
import api from '../api/axios';

interface Question {
  id: number;
  body: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface QuizData {
  id: number;
  quizId: string;
  title: string;
  questions: Question[];
}

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<number[]>([]); // User's choices

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quiz/${quizId}`);
        setQuiz(res.data);
      } catch (err: any) {
        setError('퀴즈를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    setAnswers([...answers, idx]);
  };

  const handleNext = async () => {
    if (currentIdx < (quiz?.questions.length || 0) - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Submit result
      try {
        const res = await api.post(`/quiz/${quizId}/result`, {
          answers,
        });
        navigate(`/result/${res.data.resultId}`);
      } catch (err) {
        alert('결과 제출 중 오류가 발생했습니다.');
      }
    }
  };

  if (isLoading) return <div className="nq-container items-center justify-center"><Loader2 className="animate-spin text-[var(--accent)]" size={48} /></div>;
  if (error) return <div className="nq-container items-center justify-center text-red-500">{error}</div>;
  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentIdx];
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;

  return (
    <div className="nq-container max-w-3xl mx-auto py-12">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-[var(--accent)]">문제 {currentIdx + 1} / {quiz.questions.length}</span>
          <span className="text-sm text-[var(--text)]">{Math.round(progress)}% 완료</span>
        </div>
        <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-8 leading-tight">{currentQuestion.body}</h2>

        <div className="flex flex-col gap-3 mb-8">
          {currentQuestion.options.map((option, idx) => {
            let className = "nq-button text-left py-4 px-6 border border-[var(--border)] hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)]";
            if (isAnswered) {
              if (idx === currentQuestion.answer) {
                className = "nq-button text-left py-4 px-6 border-2 border-green-500 bg-green-50 text-green-700";
              } else if (idx === selectedOption) {
                className = "nq-button text-left py-4 px-6 border-2 border-red-500 bg-red-50 text-red-700";
              } else {
                className = "nq-button text-left py-4 px-6 border border-[var(--border)] opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={className}
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full border border-current flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{option}</span>
                  {isAnswered && idx === currentQuestion.answer && <CheckCircle2 className="ml-auto text-green-500" size={20} />}
                  {isAnswered && idx === selectedOption && idx !== currentQuestion.answer && <XCircle className="ml-auto text-red-500" size={20} />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
              <HelpCircle size={20} />
              <span>해설</span>
            </div>
            <p className="text-blue-800 text-sm leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="nq-button nq-button-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {currentIdx === quiz.questions.length - 1 ? '결과 보기' : '다음 문제'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Quiz;
