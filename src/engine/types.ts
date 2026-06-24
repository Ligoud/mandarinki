export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type Mode = 'stranger' | 'call' | 'friends' | 'solo';

export type Category = 'retro' | 'mount' | 'holy' | 'food' | 'talk' | 'sea';

export interface CardDefinition {
  id: number;
  slug: string;
  category: Category;
  rarity: Rarity;
  points: number;
  mode: Mode;
  oneTake: boolean;
  title: string;
  task: string;
  art: string;
}

export interface CardProgress {
  cardId: number;
  claimed: boolean;
  photo: string | null;
  claimedAt: string | null;
}

export interface GameCard extends CardDefinition {
  claimed: boolean;
  photo: string | null;
  claimedAt: string | null;
}

export interface CategoryProgress {
  category: Category;
  claimed: number;
  total: number;
  complete: boolean;
}

export interface WinResult {
  won: boolean;
  reason: 'score' | 'categories' | 'legendary' | null;
}

export type ProgressMap = Record<number, CardProgress>;
