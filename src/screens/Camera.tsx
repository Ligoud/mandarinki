import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import {
  startCamera,
  stopCamera,
  compositePhoto,
  compositeFromFile,
  type CameraFacing,
} from '@/camera/capture';

export function Camera() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCard, claimCard } = useGameState();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [facing, setFacing] = useState<CameraFacing>('environment');

  const cardId = Number(id);
  const card = getCard(cardId);
  const isFrontCamera = facing === 'user';

  useEffect(() => {
    if (!card) {
      navigate('/collection');
    }
  }, [card, navigate]);

  useEffect(() => {
    if (!card) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    async function init() {
      stopCamera(streamRef.current);
      streamRef.current = null;
      setError(null);

      try {
        const stream = await startCamera(video!, facing);
        if (cancelled) {
          stopCamera(stream);
          return;
        }
        streamRef.current = stream;
      } catch {
        if (!cancelled) {
          setError('Нет доступа к камере. Загрузи фото из галереи.');
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
      stopCamera(streamRef.current);
      streamRef.current = null;
    };
  }, [card, facing]);

  if (!card) {
    return null;
  }

  const frameSrc = `/art/${card.art}`;

  function toggleFacing() {
    setFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  }

  async function handleCapture() {
    const video = videoRef.current;
    if (!video || capturing || !card) return;
    setCapturing(true);
    try {
      const photo = await compositePhoto(video, frameSrc, card.title, isFrontCamera);
      await claimCard(cardId, photo);
      navigate('/collection');
    } catch {
      setError('Не удалось сделать снимок. Попробуй ещё раз.');
    } finally {
      setCapturing(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !card) return;
    setCapturing(true);
    try {
      const photo = await compositeFromFile(file, frameSrc, card.title);
      await claimCard(cardId, photo);
      navigate('/collection');
    } catch {
      setError('Не удалось обработать фото.');
    } finally {
      setCapturing(false);
    }
  }

  return (
    <div className="camera-view">
      <header className="page-header" style={{ padding: '16px', margin: 0 }}>
        <button type="button" className="page-header__back" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <h1 className="title-md page-header__title">{card.title}</h1>
      </header>

      {error ? (
        <div className="camera-view__error">
          <p className="text-body">{error}</p>
          <button
            type="button"
            className="btn btn--primary"
            style={{ marginTop: 16 }}
            onClick={() => fileRef.current?.click()}
          >
            Загрузить из галереи
          </button>
        </div>
      ) : (
        <div className="camera-view__preview">
          <div className="camera-view__stage">
            <video
              ref={videoRef}
              className={`camera-view__video ${isFrontCamera ? 'camera-view__video--mirror' : ''}`}
              playsInline
              muted
            />
            <img className="camera-view__frame" src={frameSrc} alt="" />
            <div className="camera-view__title">{card.title}</div>
          </div>
        </div>
      )}

      <div className="camera-view__controls">
        {!error && (
          <>
            <button
              type="button"
              className="btn btn--secondary camera-view__flip"
              onClick={toggleFacing}
              disabled={capturing}
              aria-label="Переключить камеру"
            >
              ⟲
            </button>
            <button
              type="button"
              className="camera-view__capture"
              onClick={() => void handleCapture()}
              disabled={capturing}
              aria-label="Снять"
            />
          </>
        )}
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => fileRef.current?.click()}
          disabled={capturing}
        >
          Галерея
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void handleFileChange(e)}
      />
    </div>
  );
}
