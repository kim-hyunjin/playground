import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, FileText, ChevronRight, ChevronDown, Play, Share2 } from 'lucide-react';
import api from '../api/axios';

interface QuizInfo {
  id: number;
  quizId: string;
  createdAt: string;
  questionCount: number;
}

interface NoteInfo {
  id: number;
  noteId: string;
  title: string;
  createdAt: string;
  quizzes: QuizInfo[];
}

const MyNotes = () => {
  const [notes, setNotes] = useState<NoteInfo[]>([]);
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get('/my/notes');
        const notesWithQuizzes = await Promise.all(
          res.data.map(async (note: any) => {
            const quizRes = await api.get(`/my/notes/${note.noteId}/quizzes`);
            return { ...note, quizzes: quizRes.data };
          })
        );
        setNotes(notesWithQuizzes);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedNotes(newExpanded);
  };

  const handleShare = async (quizId: string) => {
    try {
      const res = await api.post(`/my/quizzes/${quizId}/share`);
      const shareUrl = `${window.location.origin}/share/${res.data.shareToken}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('공유 링크가 클립보드에 복사되었습니다.');
    } catch (err) {
      alert('공유 링크 생성에 실패했습니다.');
    }
  };

  if (isLoading) return <div className="nq-container items-center justify-center"><Loader2 className="animate-spin text-[var(--accent)]" size={48} /></div>;

  return (
    <div className="nq-container max-w-5xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">내 노트 및 퀴즈</h1>

      {notes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-[var(--border)]">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-[var(--text)]">아직 업로드한 노트가 없습니다.</p>
          <Link to="/" className="text-[var(--accent)] font-semibold hover:underline mt-2 inline-block">첫 노트 업로드하기</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map((note) => (
            <div key={note.id} className="border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--bg)] shadow-sm">
              <div
                onClick={() => toggleExpand(note.id)}
                className="p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center shrink-0">
                  <FileText size={24} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold">{note.title}</h3>
                  <p className="text-sm text-[var(--text)]">{new Date(note.createdAt).toLocaleDateString()} 업로드</p>
                </div>
                <div className="flex items-center gap-2 text-[var(--text)]">
                  <span className="text-sm font-medium">{note.quizzes.length}개의 퀴즈</span>
                  {expandedNotes.has(note.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </div>

              {expandedNotes.has(note.id) && (
                <div className="border-t border-[var(--border)] bg-gray-50 p-4 flex flex-col gap-2">
                  {note.quizzes.length === 0 ? (
                    <p className="text-sm text-center py-4 text-[var(--text)]">생성된 퀴즈가 없습니다.</p>
                  ) : (
                    note.quizzes.map((quiz) => (
                      <div key={quiz.id} className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between shadow-sm gap-2">
                        <div>
                          <p className="font-semibold">{quiz.questionCount}문제 퀴즈</p>
                          <p className="text-xs text-[var(--text)]">{new Date(quiz.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/quiz/${quiz.quizId}`} className="nq-button nq-button-secondary py-1.5 flex items-center gap-1 text-sm">
                            <Play size={14} /> 풀기
                          </Link>
                          <button onClick={() => handleShare(quiz.quizId)} className="nq-button border border-[var(--border)] hover:border-[var(--accent-border)] py-1.5 flex items-center gap-1 text-sm">
                            <Share2 size={14} /> 공유
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotes;
