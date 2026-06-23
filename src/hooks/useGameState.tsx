import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CardDefinition, GameCard, ProgressMap } from '@/engine/types';
import {
  mergeCardsWithProgress,
  getTotalScore,
  getCategoryProgress,
  drawRandomCard,
} from '@/engine/scoring';
import { checkWin } from '@/engine/win';
import { loadDeck, loadProgressMap, createEmptyProgress } from '@/storage/merge';
import { saveProgress } from '@/storage/db';

interface GameStateContextValue {
  loading: boolean;
  cards: CardDefinition[];
  gameCards: GameCard[];
  progress: ProgressMap;
  score: number;
  categoryProgress: ReturnType<typeof getCategoryProgress>;
  hasWon: boolean;
  currentDraw: CardDefinition | null;
  drawCard: () => void;
  skipDraw: () => void;
  claimCard: (cardId: number, photo: string) => Promise<void>;
  getCard: (id: number) => GameCard | undefined;
}

const GameStateContext = createContext<GameStateContextValue | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<CardDefinition[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [currentDraw, setCurrentDraw] = useState<CardDefinition | null>(null);

  useEffect(() => {
    async function init() {
      const [deck, saved] = await Promise.all([loadDeck(), loadProgressMap()]);
      setCards(deck);
      setProgress(saved);
      setLoading(false);
    }
    void init();
  }, []);

  const gameCards = useMemo(
    () => mergeCardsWithProgress(cards, progress),
    [cards, progress],
  );

  const score = useMemo(() => getTotalScore(cards, progress), [cards, progress]);
  const categoryProgress = useMemo(
    () => getCategoryProgress(cards, progress),
    [cards, progress],
  );
  const hasWon = useMemo(() => checkWin(cards, progress).won, [cards, progress]);

  const drawCard = useCallback(() => {
    const card = drawRandomCard(cards, progress);
    setCurrentDraw(card);
  }, [cards, progress]);

  const skipDraw = useCallback(() => {
    setCurrentDraw(null);
  }, []);

  const claimCard = useCallback(
    async (cardId: number, photo: string) => {
      const entry: typeof progress[number] = {
        ...(progress[cardId] ?? createEmptyProgress(cardId)),
        cardId,
        claimed: true,
        photo,
        claimedAt: new Date().toISOString(),
      };
      await saveProgress(entry);
      setProgress((prev) => ({ ...prev, [cardId]: entry }));
      setCurrentDraw(null);
    },
    [progress],
  );

  const getCard = useCallback(
    (id: number) => gameCards.find((c) => c.id === id),
    [gameCards],
  );

  const value: GameStateContextValue = {
    loading,
    cards,
    gameCards,
    progress,
    score,
    categoryProgress,
    hasWon,
    currentDraw,
    drawCard,
    skipDraw,
    claimCard,
    getCard,
  };

  return (
    <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>
  );
}

export function useGameState(): GameStateContextValue {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error('useGameState must be used within GameStateProvider');
  return ctx;
}
