import type { GameCard } from '@/engine/types';
import { RarityBadge, ModeBadge, CategoryBadge } from './Badges';

interface CardFrameProps {
  card: GameCard;
  showPhoto?: boolean;
}

export function CardFrame({ card, showPhoto = false }: CardFrameProps) {
  const artSrc = showPhoto && card.photo ? card.photo : `/art/${card.art}`;

  return (
    <div className={`card-frame card-frame--${card.rarity}`}>
      <img className="card-frame__art" src={artSrc} alt={card.title} />
      <div className="card-frame__body">
        <h2 className="card-frame__title">{card.title}</h2>
        <p className="card-frame__task">{card.task}</p>
        <div className="card-frame__meta">
          <RarityBadge rarity={card.rarity} />
          <ModeBadge mode={card.mode} />
          <CategoryBadge category={card.category} />
        </div>
      </div>
    </div>
  );
}
