import type { Category, Mode, Rarity } from './types';

export const RARITY_POINTS: Record<Rarity, number> = {
  common: 10,
  rare: 25,
  epic: 50,
  legendary: 100,
};

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#5E8A78',
  rare: '#3E6FA3',
  epic: '#CE6B4A',
  legendary: '#B5853C',
};

export const SET_BONUS = 50;
export const WIN_SCORE = 800;
export const WIN_CATEGORIES = 4;
export const WIN_LEGENDARY_COUNT = 3;

export const CATEGORY_LABELS: Record<Category, string> = {
  retro: 'Советский мираж',
  mount: 'Рица и горы',
  holy: 'Святые камни',
  food: 'Абхазский стол',
  talk: 'Голоса и буквы',
  sea: 'Море и ритм',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  retro: '/icons/cat-retro.svg',
  mount: '/icons/cat-mount.svg',
  holy: '/icons/cat-holy.svg',
  food: '/icons/cat-food.svg',
  talk: '/icons/cat-talk.svg',
  sea: '/icons/cat-sea.svg',
};

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Бытовая',
  rare: 'Редкая',
  epic: 'Эпик',
  legendary: 'Легендарная',
};

export const RARITY_ICONS: Record<Rarity, string> = {
  common: '/icons/rarity-common.svg',
  rare: '/icons/rarity-rare.svg',
  epic: '/icons/rarity-epic.svg',
  legendary: '/icons/rarity-legendary.svg',
};

export const MODE_LABELS: Record<Mode, string> = {
  stranger: 'с незнакомцем',
  call: 'созвон с роднёй',
  friends: 'с подругами',
  solo: 'соло',
};

export const MODE_ICONS: Record<Mode, string> = {
  stranger: '/icons/mode-stranger.svg',
  call: '/icons/mode-call.svg',
  friends: '/icons/mode-friends.svg',
  solo: '/icons/mode-solo.svg',
};

export const ALL_CATEGORIES: Category[] = [
  'retro',
  'mount',
  'holy',
  'food',
  'talk',
  'sea',
];
