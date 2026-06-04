import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/auth/signup', { email, password, nickname });
      alert('회원가입이 완료되었습니다. 로그인해 주세요.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nq-container flex justify-center items-center py-20">
      <div className="w-full max-w-md border border-[var(--border)] rounded-2xl p-8 bg-[var(--bg)] shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-center">회원가입</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">닉네임</label>
            <input
              type="text"
              className="nq-input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input
              type="email"
              className="nq-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">비밀번호</label>
            <input
              type="password"
              className="nq-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="nq-button nq-button-primary w-full py-3 mt-4 disabled:opacity-50"
          >
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-[var(--accent)] hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
