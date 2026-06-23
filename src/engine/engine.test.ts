import { describe, it, expect } from 'vitest';
import type { CardDefinition, ProgressMap } from './types';
import {
  getCardPoints,
  getSetBonus,
  getTotalScore,
  getCategoryProgress,
  getCompletedCategories,
  getLegendaryClaimedCount,
  drawRandomCard,
} from './scoring';
import { checkWin } from './win';
import { SET_BONUS } from './constants';

const sampleCards: CardDefinition[] = [
  { id: 1, category: 'soviet', rarity: 'common', points: 10, mode: 'solo', title: 'A', task: 't', art: 'a.svg' },
  { id: 2, category: 'soviet', rarity: 'rare', points: 25, mode: 'solo', title: 'B', task: 't', art: 'b.svg' },
  { id: 3, category: 'ritsa', rarity: 'legendary', points: 100, mode: 'call', title: 'C', task: 't', art: 'c.svg' },
  { id: 4, category: 'ritsa', rarity: 'common', points: 10, mode: 'solo', title: 'D', task: 't', art: 'd.svg' },
  { id: 5, category: 'sea', rarity: 'legendary', points: 100, mode: 'call', title: 'E', task: 't', art: 'e.svg' },
  { id: 6, category: 'sea', rarity: 'legendary', points: 100, mode: 'solo', title: 'F', task: 't', art: 'f.svg' },
];

function claimed(...ids: number[]): ProgressMap {
  const map: ProgressMap = {};
  for (const id of ids) {
    map[id] = { cardId: id, claimed: true, photo: 'data:', claimedAt: '2026-01-01' };
  }
  return map;
}

describe('getCardPoints', () => {
  it('returns card points', () => {
    expect(getCardPoints(sampleCards[0])).toBe(10);
    expect(getCardPoints(sampleCards[2])).toBe(100);
  });
});

describe('getSetBonus', () => {
  it('gives bonus when category is complete', () => {
    const progress = claimed(1, 2);
    expect(getSetBonus(sampleCards, progress)).toBe(SET_BONUS);
  });

  it('gives no bonus for partial category', () => {
    expect(getSetBonus(sampleCards, claimed(1))).toBe(0);
  });
});

describe('getTotalScore', () => {
  it('sums card points and set bonuses', () => {
    const progress = claimed(1, 2);
    expect(getTotalScore(sampleCards, progress)).toBe(10 + 25 + SET_BONUS);
  });
});

describe('getCategoryProgress', () => {
  it('tracks claimed per category', () => {
    const progress = claimed(1);
    const result = getCategoryProgress(sampleCards, progress);
    const soviet = result.find((r) => r.category === 'soviet');
    expect(soviet?.claimed).toBe(1);
    expect(soviet?.total).toBe(2);
    expect(soviet?.complete).toBe(false);
  });
});

describe('checkWin', () => {
  it('wins by score threshold', () => {
    const cards: CardDefinition[] = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      category: 'soviet',
      rarity: 'epic',
      points: 50,
      mode: 'solo',
      title: `Card ${i}`,
      task: 't',
      art: 'a.svg',
    }));
    const progress = claimed(...cards.slice(0, 16).map((c) => c.id));
    expect(checkWin(cards, progress).won).toBe(true);
    expect(checkWin(cards, progress).reason).toBe('score');
  });

  it('wins by legendary count', () => {
    const progress = claimed(3, 5, 6);
    expect(getLegendaryClaimedCount(sampleCards, progress)).toBe(3);
    expect(checkWin(sampleCards, progress).won).toBe(true);
    expect(checkWin(sampleCards, progress).reason).toBe('legendary');
  });

  it('does not win with partial progress', () => {
    expect(checkWin(sampleCards, claimed(1)).won).toBe(false);
  });
});

describe('drawRandomCard', () => {
  it('returns unclaimed card', () => {
    const card = drawRandomCard(sampleCards, claimed(1, 2));
    expect(card).not.toBeNull();
    expect([3, 4, 5, 6]).toContain(card!.id);
  });

  it('returns null when all claimed', () => {
    expect(drawRandomCard(sampleCards, claimed(1, 2, 3, 4, 5, 6))).toBeNull();
  });
});

describe('getCompletedCategories', () => {
  it('lists fully claimed categories', () => {
    expect(getCompletedCategories(sampleCards, claimed(1, 2))).toEqual(['soviet']);
  });
});
