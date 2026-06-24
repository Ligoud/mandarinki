import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { CATEGORY_LABELS } from '@/engine/constants';
import type { Category, GameCard } from '@/engine/types';
import { sharePhoto } from '@/utils/sharePhoto';

function shareCardPhoto(card: GameCard) {
  if (!card.photo) return;
  return sharePhoto(card.photo, `mandarinka-${card.slug}.jpg`, {
    title: card.title,
    text: card.title,
  });
}

export function Collection() {
  const navigate = useNavigate();
  const { gameCards } = useGameState();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [viewerId, setViewerId] = useState<number | null>(null);

  const filtered =
    filter === 'all' ? gameCards : gameCards.filter((c) => c.category === filter);

  const viewerCard = viewerId != null ? gameCards.find((c) => c.id === viewerId) : null;

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/" className="page-header__back">
          ← Назад
        </Link>
        <h1 className="title-md page-header__title">Коллекция</h1>
      </header>

      <div className="filter-bar">
        <button
          type="button"
          className={`filter-chip ${filter === 'all' ? 'filter-chip--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-chip ${filter === cat ? 'filter-chip--active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="collection-grid">
        {filtered.map((card) => (
          <div
            key={card.id}
            className={`collection-item collection-item--${card.rarity} ${card.claimed ? 'collection-item--claimed' : ''}`}
            onClick={() => {
              if (card.claimed && card.photo) {
                setViewerId(card.id);
              } else if (!card.claimed) {
                navigate(`/camera/${card.id}`);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (card.claimed && card.photo) setViewerId(card.id);
                else if (!card.claimed) navigate(`/camera/${card.id}`);
              }
            }}
            role="button"
            tabIndex={0}
          >
            {card.claimed && card.photo ? (
              <>
                <img className="collection-item__thumb" src={card.photo} alt={card.title} />
                <span className="collection-item__title">{card.title}</span>
              </>
            ) : (
              <div className="collection-item__placeholder">
                <img
                  className="collection-item__placeholder-art"
                  src={`/art/${card.art}`}
                  alt=""
                />
                <span className="collection-item__label">{card.title}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {viewerCard?.photo && (
        <div className="overlay" onClick={() => setViewerId(null)}>
          <div className="photo-viewer" onClick={(e) => e.stopPropagation()}>
            <img src={viewerCard.photo} alt={viewerCard.title} />
            <div className="photo-viewer__actions">
              <button
                type="button"
                className="btn btn--primary btn--full"
                onClick={() => void shareCardPhoto(viewerCard)}
              >
                Поделиться
              </button>
              <button
                type="button"
                className="btn btn--secondary btn--full"
                onClick={() => setViewerId(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
