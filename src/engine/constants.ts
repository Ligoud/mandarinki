import type { Category, Mode, Rarity } from './types';

export const RARITY_POINTS: Record<Rarity, number> = {
  common: 10,
  rare: 25,
  epic: 50,
  legendary: 100,
};

export const SET_BONUS = 50;
export const WIN_SCORE = 800;
export const WIN_CATEGORIES = 4;
export const WIN_LEGENDARY_COUNT = 3;

export const CATEGORY_LABELS: Record<Category, string> = {
  soviet: 'Советский мираж',
  ritsa: 'Рица и горы',
  sacred: 'Святые камни',
  table: 'Абхазский стол',
  voices: 'Голоса и буквы',
  sea: 'Море и ритм',
};

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Бытовая',
  rare: 'Редкая',
  epic: 'Эпик',
  legendary: 'Легендарная',
};

export const MODE_LABELS: Record<Mode, string> = {
  stranger: 'С незнакомцем',
  call: 'Созвон с роднёй',
  friends: 'С подругами',
  solo: 'Соло',
};

export const ALL_CATEGORIES: Category[] = [
  'soviet',
  'ritsa',
  'sacred',
  'table',
  'voices',
  'sea',
];
