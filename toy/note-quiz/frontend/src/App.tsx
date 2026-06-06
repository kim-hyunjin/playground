import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import MyNotes from './pages/MyNotes';
import WrongAnswers from './pages/WrongAnswers';
import Settings from './pages/Settings';
import Share from './pages/Share';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={logout} />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/result/:resultId" element={<Result />} />
          <Route path="/share/:shareToken" element={<Share />} />
          <Route path="/my/notes" element={<ProtectedRoute><MyNotes /></ProtectedRoute>} />
          <Route path="/my/wrong" element={<ProtectedRoute><WrongAnswers /></ProtectedRoute>} />
          <Route path="/my/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </main>
      <footer className="p-4 text-center border-t border-[var(--border)] text-sm text-[var(--text)]">
        &copy; 2026 NoteQuiz. All rights reserved.
      </footer>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
