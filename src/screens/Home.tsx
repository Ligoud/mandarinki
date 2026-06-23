import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { ProgressBar } from '@/components/ProgressBar';
import { WinOverlay } from '@/components/WinOverlay';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';
import { CATEGORY_LABELS } from '@/engine/constants';
import { WIN_SCORE } from '@/engine/constants';

export function Home() {
  const navigate = useNavigate();
  const [winDismissed, setWinDismissed] = useState(false);
  const { loading, score, categoryProgress, hasWon, cards, progress, drawCard } =
    useGameState();

  function handleDraw() {
    drawCard();
    navigate('/draw');
  }

  if (loading) {
    return <div className="loading-screen">Загрузка…</div>;
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="title-xl page-header__title">Мандаринка</h1>
      </header>

      <div className="score-display">
        <div className="score-display__value">{score}</div>
        <div className="score-display__label">очков · цель {WIN_SCORE}</div>
      </div>

      <div className="category-progress-list">
        {categoryProgress.map((cp) => (
          <ProgressBar
            key={cp.category}
            label={CATEGORY_LABELS[cp.category]}
            value={cp.claimed}
            max={cp.total}
          />
        ))}
      </div>

      <button type="button" className="btn btn--primary btn--full" onClick={handleDraw}>
        Тянуть карту
      </button>

      <PwaInstallPrompt />

      <nav className="nav-links">
        <Link to="/collection" className="btn btn--secondary">
          Коллекция
        </Link>
        <Link to="/export" className="btn btn--secondary">
          Экспорт фото
        </Link>
      </nav>

      {hasWon && !winDismissed && (
        <WinOverlay
          cards={cards}
          progress={progress}
          onDismiss={() => setWinDismissed(true)}
        />
      )}
    </div>
  );
}
