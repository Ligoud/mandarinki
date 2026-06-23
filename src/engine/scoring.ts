import { SET_BONUS } from './constants';
import type {
  CardDefinition,
  Category,
  CategoryProgress,
  GameCard,
  ProgressMap,
} from './types';

export function getCardPoints(card: CardDefinition): number {
  return card.points;
}

export function isClaimed(cardId: number, progress: ProgressMap): boolean {
  return progress[cardId]?.claimed ?? false;
}

export function getClaimedCardIds(progress: ProgressMap): Set<number> {
  const ids = new Set<number>();
  for (const [id, p] of Object.entries(progress)) {
    if (p.claimed) ids.add(Number(id));
  }
  return ids;
}

export function getCompletedCategories(
  cards: CardDefinition[],
  progress: ProgressMap,
): Category[] {
  const byCategory = new Map<Category, CardDefinition[]>();
  for (const card of cards) {
    const list = byCategory.get(card.category) ?? [];
    list.push(card);
    byCategory.set(card.category, list);
  }

  const completed: Category[] = [];
  for (const [category, categoryCards] of byCategory) {
    if (categoryCards.every((c) => isClaimed(c.id, progress))) {
      completed.push(category);
    }
  }
  return completed;
}

export function getSetBonus(cards: CardDefinition[], progress: ProgressMap): number {
  return getCompletedCategories(cards, progress).length * SET_BONUS;
}

export function getCardScore(cards: CardDefinition[], progress: ProgressMap): number {
  let total = 0;
  for (const card of cards) {
    if (isClaimed(card.id, progress)) {
      total += getCardPoints(card);
    }
  }
  return total;
}

export function getTotalScore(cards: CardDefinition[], progress: ProgressMap): number {
  return getCardScore(cards, progress) + getSetBonus(cards, progress);
}

export function getCategoryProgress(
  cards: CardDefinition[],
  progress: ProgressMap,
): CategoryProgress[] {
  const byCategory = new Map<Category, { claimed: number; total: number }>();

  for (const card of cards) {
    const entry = byCategory.get(card.category) ?? { claimed: 0, total: 0 };
    entry.total += 1;
    if (isClaimed(card.id, progress)) entry.claimed += 1;
    byCategory.set(card.category, entry);
  }

  return Array.from(byCategory.entries()).map(([category, { claimed, total }]) => ({
    category,
    claimed,
    total,
    complete: claimed === total && total > 0,
  }));
}

export function getLegendaryClaimedCount(
  cards: CardDefinition[],
  progress: ProgressMap,
): number {
  return cards.filter((c) => c.rarity === 'legendary' && isClaimed(c.id, progress)).length;
}

export function drawRandomCard(
  cards: CardDefinition[],
  progress: ProgressMap,
): CardDefinition | null {
  const unclaimed = cards.filter((c) => !isClaimed(c.id, progress));
  if (unclaimed.length === 0) return null;
  const index = Math.floor(Math.random() * unclaimed.length);
  return unclaimed[index] ?? null;
}

export function mergeCardsWithProgress(
  cards: CardDefinition[],
  progress: ProgressMap,
): GameCard[] {
  return cards.map((card) => {
    const p = progress[card.id];
    return {
      ...card,
      claimed: p?.claimed ?? false,
      photo: p?.photo ?? null,
      claimedAt: p?.claimedAt ?? null,
    };
  });
}
