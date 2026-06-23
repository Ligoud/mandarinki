import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { CardFrame } from '@/components/CardFrame';
import { mergeCardsWithProgress } from '@/engine/scoring';

export function CardDraw() {
  const navigate = useNavigate();
  const { currentDraw, progress, skipDraw } = useGameState();

  useEffect(() => {
    if (!currentDraw) {
      navigate('/');
    }
  }, [currentDraw, navigate]);

  if (!currentDraw) {
    return null;
  }

  const [gameCard] = mergeCardsWithProgress([currentDraw], progress);

  function handleSkip() {
    skipDraw();
    navigate('/');
  }

  return (
    <div className="page">
      <header className="page-header">
        <button type="button" className="page-header__back" onClick={handleSkip}>
          ← Назад
        </button>
        <h1 className="title-md page-header__title">Твоя карта</h1>
      </header>

      <CardFrame card={gameCard} />

      <div className="card-actions">
        <button
          type="button"
          className="btn btn--primary btn--full"
          onClick={() => navigate(`/camera/${currentDraw.id}`)}
        >
          Снять
        </button>
        <button type="button" className="btn btn--ghost btn--full" onClick={handleSkip}>
          Пропустить
        </button>
      </div>
    </div>
  );
}
