import { usePwaInstall } from '@/hooks/usePwaInstall';

export function PwaInstallPrompt() {
  const { showInstallButton, showIosHint, install } = usePwaInstall();

  if (!showInstallButton && !showIosHint) {
    return null;
  }

  if (showInstallButton) {
    return (
      <div className="pwa-install">
        <button type="button" className="btn btn--secondary btn--full" onClick={() => void install()}>
          Установить приложение
        </button>
        <p className="pwa-install__note text-xs">
          Иконка на экране · работает офлайн
        </p>
      </div>
    );
  }

  return (
    <div className="pwa-install pwa-install--ios">
      <p className="pwa-install__title text-sm">Установить на iPhone</p>
      <ol className="pwa-install__steps text-xs">
        <li>Открой сайт в <strong>Safari</strong></li>
        <li>Внизу экрана — панель <strong>браузера</strong></li>
        <li>Нажми <strong>□↑</strong> (меню Safari)</li>
        <li>Выбери <strong>«На экран Домой»</strong></li>
      </ol>
      <p className="pwa-install__note text-xs">
        Это настройка Safari, не кнопки в игре ниже
      </p>
    </div>
  );
}
