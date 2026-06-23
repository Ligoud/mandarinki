import type { CardDefinition, CardProgress, ProgressMap } from '@/engine/types';
import { getAllProgress } from './db';

export function progressListToMap(list: CardProgress[]): ProgressMap {
  const map: ProgressMap = {};
  for (const item of list) {
    map[item.cardId] = item;
  }
  return map;
}

export async function loadProgressMap(): Promise<ProgressMap> {
  const list = await getAllProgress();
  return progressListToMap(list);
}

export function createEmptyProgress(cardId: number): CardProgress {
  return {
    cardId,
    claimed: false,
    photo: null,
    claimedAt: null,
  };
}

export async function loadDeck(): Promise<CardDefinition[]> {
  const module = await import('@/data/deck.json');
  return module.default as CardDefinition[];
}
