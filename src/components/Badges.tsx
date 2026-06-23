import type { Rarity, Mode, Category } from '@/engine/types';
import { RARITY_LABELS, MODE_LABELS, CATEGORY_LABELS } from '@/engine/constants';

interface RarityBadgeProps {
  rarity: Rarity;
}

export function RarityBadge({ rarity }: RarityBadgeProps) {
  return (
    <span className={`rarity-badge rarity-badge--${rarity}`}>
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
      {MODE_LABELS[mode]}
    </span>
  );
}

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="category-badge">{CATEGORY_LABELS[category]}</span>
  );
}
