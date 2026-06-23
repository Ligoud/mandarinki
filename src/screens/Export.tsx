import { Link } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { dataUrlToBlob } from '@/camera/capture';

export function Export() {
  const { gameCards, score } = useGameState();
  const claimed = gameCards.filter((c) => c.claimed && c.photo);

  async function shareAll() {
    if (claimed.length === 0) return;

    const files = claimed.map((card) => {
      const blob = dataUrlToBlob(card.photo!);
      return new File([blob], `mandarinki-${card.id}.jpg`, { type: 'image/jpeg' });
    });

    if (navigator.canShare?.({ files })) {
      await navigator.share({
        title: 'Мандаринка',
        text: `Моя коллекция: ${score} очков, ${claimed.length} карт`,
        files,
      });
      return;
    }

    for (const card of claimed) {
      downloadPhoto(card.photo!, `mandarinki-${card.id}.jpg`);
    }
  }

  function downloadPhoto(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/" className="page-header__back">
          ← Назад
        </Link>
        <h1 className="title-md page-header__title">Экспорт фото</h1>
      </header>

      <p className="text-body" style={{ marginBottom: 24 }}>
        {claimed.length} фото · {score} очков
      </p>

      {claimed.length > 0 ? (
        <>
          <button type="button" className="btn btn--primary btn--full" onClick={() => void shareAll()}>
            Отправить все фото
          </button>

          <div className="export-list" style={{ marginTop: 24 }}>
            {claimed.map((card) => (
              <div key={card.id} className="export-item">
                <img className="export-item__thumb" src={card.photo!} alt={card.title} />
                <div style={{ flex: 1 }}>
                  <div className="text-body">{card.title}</div>
                  <div className="text-xs">+{card.points} очков</div>
                </div>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => downloadPhoto(card.photo!, `mandarinki-${card.id}.jpg`)}
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm">Пока нет собранных карт. Тяни карту и снимай!</p>
      )}
    </div>
  );
}
