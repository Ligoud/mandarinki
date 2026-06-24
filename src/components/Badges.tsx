import type { Rarity, Mode, Category } from '@/engine/types';
import {
  RARITY_LABELS,
  MODE_LABELS,
  CATEGORY_LABELS,
  RARITY_ICONS,
  MODE_ICONS,
  CATEGORY_ICONS,
} from '@/engine/constants';

interface RarityBadgeProps {
  rarity: Rarity;
}

export function RarityBadge({ rarity }: RarityBadgeProps) {
  return (
    <span className={`rarity-badge rarity-badge--${rarity}`}>
      <img className="badge-icon" src={RARITY_ICONS[rarity]} alt="" />
      {RARITY_LABELS[rarity]}
    </span>
  );
}

interface ModeBadgeProps {
  mode: Mode;
}

export function ModeBadge({ mode }: ModeBadgeProps) {
  return (
    <span className={`mode-badge mode-badge--${mode}`}>
      <img className="badge-icon" src={MODE_ICONS[mode]} alt="" />
      {MODE_LABELS[mode]}
    </span>
  );
}

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="category-badge">
      <img className="badge-icon" src={CATEGORY_ICONS[category]} alt="" />
      {CATEGORY_LABELS[category]}
    </span>
  );
}
