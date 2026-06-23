import { checkWin, getWinReasonLabel } from '@/engine/win';
import type { CardDefinition, ProgressMap } from '@/engine/types';

interface WinOverlayProps {
  cards: CardDefinition[];
  progress: ProgressMap;
  onDismiss: () => void;
}

export function WinOverlay({ cards, progress, onDismiss }: WinOverlayProps) {
  const result = checkWin(cards, progress);
  if (!result.won) return null;

  return (
    <div className="overlay">
      <div className="overlay__content">
        <div className="win-celebration">🍊</div>
        <h2 className="title-lg">Победа!</h2>
        <p className="text-body" style={{ margin: '16px 0' }}>
          {getWinReasonLabel(result.reason)}
        </p>
        <button type="button" className="btn btn--primary btn--full" onClick={onDismiss}>
          Продолжить
        </button>
      </div>
    </div>
  );
}
