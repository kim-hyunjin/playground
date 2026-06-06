import { useState, useEffect } from 'react';
import { Loader2, Bell, Clock, List, Save } from 'lucide-react';
import api from '../api/axios';

interface NotificationSetting {
  dailyQuizEnabled: boolean;
  dailyQuizTime: string;
  targetNotes: {
    noteId: string;
    title: string;
    questionCount: number;
    selected: boolean;
  }[];
}

const Settings = () => {
  const [settings, setSettings] = useState<NotificationSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/my/settings/notification');
        setSettings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = () => {
    if (!settings) return;
    setSettings({ ...settings, dailyQuizEnabled: !settings.dailyQuizEnabled });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    setSettings({ ...settings, dailyQuizTime: e.target.value });
  };

  const handleNoteSelect = (noteId: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      targetNotes: settings.targetNotes.map(n => n.noteId === noteId ? { ...n, selected: !n.selected } : n)
    });
  };

  const handleCountChange = (noteId: string, count: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      targetNotes: settings.targetNotes.map(n => n.noteId === noteId ? { ...n, questionCount: count } : n)
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await api.put('/my/settings/notification', settings);
      alert('설정이 저장되었습니다.');
    } catch (err) {
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="nq-container items-center justify-center"><Loader2 className="animate-spin text-[var(--accent)]" size={48} /></div>;
  if (!settings) return null;

  return (
    <div className="nq-container max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">알림 설정</h1>

      <div className="flex flex-col gap-8">
        <section className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">오늘의 퀴즈 알림</h3>
                <p className="text-sm text-[var(--text)]">매일 정해진 시간에 복습 퀴즈를 이메일로 보내드립니다.</p>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className={`w-14 h-8 rounded-full transition-colors relative ${settings.dailyQuizEnabled ? 'bg-[var(--accent)]' : 'bg-gray-200'}`}
            >
              <div className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-all ${settings.dailyQuizEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {settings.dailyQuizEnabled && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                <Clock size={20} className="text-[var(--text)]" />
                <span className="font-medium">알림 시간 설정</span>
                <input
                  type="time"
                  value={settings.dailyQuizTime}
                  onChange={handleTimeChange}
                  className="nq-input w-auto font-mono text-lg"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 font-semibold">
                  <List size={20} />
                  <span>대상 노트 선택 및 문제 수</span>
                </div>
                <div className="flex flex-col gap-3">
                  {settings.targetNotes.map((note) => (
                    <div key={note.noteId} className="flex items-center gap-4 p-4 border border-[var(--border)] rounded-xl">
                      <input
                        type="checkbox"
                        checked={note.selected}
                        onChange={() => handleNoteSelect(note.noteId)}
                        className="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      <span className="flex-grow font-medium">{note.title}</span>
                      {note.selected && (
                        <select
                          value={note.questionCount}
                          onChange={(e) => handleCountChange(note.noteId, parseInt(e.target.value))}
                          className="bg-transparent border border-[var(--border)] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        >
                          {[3, 5, 10].map(c => <option key={c} value={c}>{c}문제</option>)}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="nq-button nq-button-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          설정 저장하기
        </button>
      </div>
    </div>
  );
};

export default Settings;
