import { dataUrlToBlob } from '@/camera/capture';

export function downloadPhoto(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export async function sharePhoto(
  dataUrl: string,
  filename: string,
  options?: { title?: string; text?: string },
): Promise<void> {
  const blob = dataUrlToBlob(dataUrl);
  const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: options?.title ?? 'Мандаринка',
      text: options?.text,
      files: [file],
    });
    return;
  }

  downloadPhoto(dataUrl, filename);
}
