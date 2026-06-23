import {
  WIN_CATEGORIES,
  WIN_LEGENDARY_COUNT,
  WIN_SCORE,
} from './constants';
import {
  getCompletedCategories,
  getLegendaryClaimedCount,
  getTotalScore,
} from './scoring';
import type { CardDefinition, ProgressMap, WinResult } from './types';

export function checkWin(cards: CardDefinition[], progress: ProgressMap): WinResult {
  const score = getTotalScore(cards, progress);
  if (score >= WIN_SCORE) {
    return { won: true, reason: 'score' };
  }

  const completedCategories = getCompletedCategories(cards, progress);
  if (completedCategories.length >= WIN_CATEGORIES) {
    return { won: true, reason: 'categories' };
  }

  const legendaryClaimed = getLegendaryClaimedCount(cards, progress);
  if (legendaryClaimed >= WIN_LEGENDARY_COUNT) {
    return { won: true, reason: 'legendary' };
  }

  return { won: false, reason: null };
}

export function getWinReasonLabel(reason: WinResult['reason']): string {
  switch (reason) {
    case 'score':
      return `${WIN_SCORE} очков!`;
    case 'categories':
      return `${WIN_CATEGORIES} категории собраны!`;
    case 'legendary':
      return 'Все легендарные карты!';
    default:
      return '';
  }
}
