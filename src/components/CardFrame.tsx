import type { GameCard } from '@/engine/types';
import { RarityBadge, ModeBadge, CategoryBadge } from './Badges';

interface CardFrameProps {
  card: GameCard;
  showPhoto?: boolean;
}

export function CardFrame({ card, showPhoto = false }: CardFrameProps) {
  return (
    <div className={`card-frame card-frame--${card.rarity}`}>
      {showPhoto && card.photo ? (
        <img className="card-frame__photo" src={card.photo} alt={card.title} />
      ) : (
        <div className="card-frame__illustration">
          <img className="card-frame__art" src={`/art/${card.art}`} alt="" />
        </div>
      )}
      <div className="card-frame__body">
        <h2 className="card-frame__title">{card.title}</h2>
        <p className="card-frame__task">{card.task}</p>
        {card.oneTake && <p className="card-frame__onetake text-xs">Один дубль</p>}
        <div className="card-frame__meta">
          <RarityBadge rarity={card.rarity} />
          <ModeBadge mode={card.mode} />
          <CategoryBadge category={card.category} />
        </div>
      </div>
    </div>
  );
}
