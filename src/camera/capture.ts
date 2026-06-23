const JPEG_QUALITY = 0.85;

/** Card frame aspect ratio — matches SVG viewBox and collection cells */
export const CARD_ASPECT = 3 / 4;
export const OUTPUT_WIDTH = 900;
export const OUTPUT_HEIGHT = 1200;

export interface CropRect {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
}

/** Center-crop source to target aspect ratio (same as object-fit: cover in a 3:4 box). */
export function computeCenterCrop(
  sourceWidth: number,
  sourceHeight: number,
  targetAspect: number = CARD_ASPECT,
): CropRect {
  const sourceAspect = sourceWidth / sourceHeight;

  if (sourceAspect > targetAspect) {
    const sHeight = sourceHeight;
    const sWidth = sourceHeight * targetAspect;
    return {
      sx: (sourceWidth - sWidth) / 2,
      sy: 0,
      sWidth,
      sHeight,
    };
  }

  const sWidth = sourceWidth;
  const sHeight = sourceWidth / targetAspect;
  return {
    sx: 0,
    sy: (sourceHeight - sHeight) / 2,
    sWidth,
    sHeight,
  };
}

export async function startCamera(
  video: HTMLVideoElement,
): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: 'environment' } },
    audio: false,
  });
  video.srcObject = stream;
  await video.play();
  return stream;
}

export function stopCamera(stream: MediaStream | null): void {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    track.stop();
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load frame: ${src}`));
    img.src = src;
  });
}

function drawCardComposite(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  frame: HTMLImageElement,
  sourceWidth: number,
  sourceHeight: number,
): void {
  const crop = computeCenterCrop(sourceWidth, sourceHeight);
  ctx.drawImage(
    source,
    crop.sx,
    crop.sy,
    crop.sWidth,
    crop.sHeight,
    0,
    0,
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT,
  );
  ctx.drawImage(frame, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);
}

export async function compositePhoto(
  video: HTMLVideoElement,
  frameSrc: string,
): Promise<string> {
  const frame = await loadImage(frameSrc);
  const w = video.videoWidth;
  const h = video.videoHeight;
  if (!w || !h) throw new Error('Video not ready');

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  drawCardComposite(ctx, video, frame, w, h);

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

export async function compositeFromFile(
  file: File,
  frameSrc: string,
): Promise<string> {
  const frame = await loadImage(frameSrc);
  const bitmap = await createImageBitmap(file);

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  drawCardComposite(ctx, bitmap, frame, bitmap.width, bitmap.height);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',');
  const mime = header?.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const binary = atob(data ?? '');
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}
