import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const Home = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'extracting' | 'generating' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadAndGenerate = async () => {
    if (!file || !title) return;

    setStatus('uploading');
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      // 1. Upload and Extract Text
      const uploadRes = await api.post('/notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { noteId } = uploadRes.data;

      // 2. Generate Quiz
      setStatus('generating');
      const genRes = await api.post('/quiz/generate', {
        noteId,
        questionCount,
      });

      setStatus('success');
      navigate(`/quiz/${genRes.data.quizId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '처리 중 오류가 발생했습니다.');
      setStatus('error');
    }
  };

  return (
    <div className="nq-container max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">당신의 노트를 퀴즈로 만드세요</h1>
        <p className="text-lg text-[var(--text)]">PDF나 이미지를 업로드하면 AI가 핵심 내용을 파악해 문제를 만들어줍니다.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">노트 제목</label>
            <input
              type="text"
              className="nq-input text-lg py-3"
              placeholder="예: 운영체제 1강, 토익 영단어..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
              file ? 'border-[var(--accent)] bg-[var(--accent-bg)]' : 'border-[var(--border)] hover:border-[var(--accent-border)]'
            }`}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
            <div className="flex flex-col items-center gap-4">
              {file ? (
                <>
                  <CheckCircle2 className="text-[var(--accent)]" size={48} />
                  <div>
                    <p className="font-semibold text-lg">{file.name}</p>
                    <p className="text-sm text-[var(--text)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    파일 제거
                  </button>
                </>
              ) : (
                <>
                  <Upload className="text-[var(--text)]" size={48} />
                  <div>
                    <p className="font-semibold text-lg">파일을 선택하거나 여기로 드래그하세요</p>
                    <p className="text-sm text-[var(--text)]">PDF, PNG, JPG (최대 20MB)</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border border-[var(--border)] rounded-2xl p-6 bg-[var(--bg)] h-fit">
          <div>
            <label className="block text-sm font-semibold mb-3">문제 수 설정</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 rounded-lg text-sm font-medium border ${
                    questionCount === count
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'border-[var(--border)] hover:border-[var(--accent-border)]'
                  }`}
                >
                  {count}개
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleUploadAndGenerate}
            disabled={!file || !title || status !== 'idle'}
            className="nq-button nq-button-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === 'idle' ? (
              <>
                <FileText size={20} />
                문제 생성하기
              </>
            ) : (
              <>
                <Loader2 className="animate-spin" size={20} />
                {status === 'uploading' ? '업로드 중...' : 'AI 분석 중...'}
              </>
            )}
          </button>

          {status === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-red-600 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
