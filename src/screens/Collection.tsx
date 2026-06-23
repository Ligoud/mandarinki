import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { CATEGORY_LABELS } from '@/engine/constants';
import type { Category } from '@/engine/types';

export function Collection() {
  const navigate = useNavigate();
  const { gameCards } = useGameState();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [viewer, setViewer] = useState<string | null>(null);

  const filtered =
    filter === 'all' ? gameCards : gameCards.filter((c) => c.category === filter);

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
            className={`collection-item ${card.claimed ? 'collection-item--claimed' : ''}`}
            onClick={() => {
              if (card.claimed && card.photo) {
                setViewer(card.photo);
              } else if (!card.claimed) {
                navigate(`/camera/${card.id}`);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (card.claimed && card.photo) setViewer(card.photo);
                else if (!card.claimed) navigate(`/camera/${card.id}`);
              }
            }}
            role="button"
            tabIndex={0}
          >
            {card.claimed && card.photo ? (
              <img className="collection-item__thumb" src={card.photo} alt={card.title} />
            ) : (
              <div className="collection-item__placeholder">
                <img src={`/art/${card.art}`} alt="" style={{ width: '60%', opacity: 0.3 }} />
                <span className="collection-item__label">{card.title}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {viewer && (
        <div className="overlay" onClick={() => setViewer(null)}>
          <div className="photo-viewer" onClick={(e) => e.stopPropagation()}>
            <img src={viewer} alt="Фото карты" />
            <button
              type="button"
              className="btn btn--secondary btn--full"
              style={{ marginTop: 16 }}
              onClick={() => setViewer(null)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
