import { Link, useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, Settings, AlertCircle } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header = ({ isLoggedIn, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="border-b border-[var(--border)] p-4 md:px-8 flex justify-between items-center bg-[var(--bg)]">
      <Link to="/" className="text-2xl font-bold text-[var(--accent)] tracking-tighter">
        NoteQuiz
      </Link>
      <nav className="flex gap-4 items-center">
        {isLoggedIn ? (
          <>
            <Link to="/my/notes" className="flex items-center gap-1 hover:text-[var(--accent)]" title="내 노트">
              <BookOpen size={20} />
              <span className="hidden md:inline">내 노트</span>
            </Link>
            <Link to="/my/wrong" className="flex items-center gap-1 hover:text-[var(--accent)]" title="오답 노트">
              <AlertCircle size={20} />
              <span className="hidden md:inline">오답 노트</span>
            </Link>
            <Link to="/my/settings" className="flex items-center gap-1 hover:text-[var(--accent)]" title="설정">
              <Settings size={20} />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 hover:text-[var(--accent)]"
              title="로그아웃"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nq-button nq-button-secondary py-1">
              로그인
            </Link>
            <Link to="/signup" className="nq-button nq-button-primary py-1">
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
