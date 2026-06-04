interface HeaderProps {
  title?: string;
  onBack?: () => void;
}

export default function Header({ title = 'MY위키', onBack }: HeaderProps) {
  return (
    <header className="h-12 bg-primary text-white text-2xl flex items-center px-2 justify-between">
      <div className="flex items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-3 text-lg cursor-pointer hover:underline"
          >
            ← 뒤로
          </button>
        )}
        <span>{title}</span>
      </div>
    </header>
  );
}
