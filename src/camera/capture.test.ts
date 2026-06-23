import { describe, it, expect } from 'vitest';
import { computeCenterCrop, CARD_ASPECT } from './capture';

describe('computeCenterCrop', () => {
  it('crops sides when source is wider than 3:4', () => {
    const crop = computeCenterCrop(1920, 1080, CARD_ASPECT);
    expect(crop.sy).toBe(0);
    expect(crop.sHeight).toBe(1080);
    expect(crop.sWidth).toBeCloseTo(810);
    expect(crop.sx).toBeCloseTo(555);
  });

  it('crops top/bottom when source is taller than 3:4', () => {
    const crop = computeCenterCrop(1080, 1920, CARD_ASPECT);
    expect(crop.sx).toBe(0);
    expect(crop.sWidth).toBe(1080);
    expect(crop.sHeight).toBeCloseTo(1440);
    expect(crop.sy).toBeCloseTo(240);
  });

  it('returns full frame when aspect matches', () => {
    const crop = computeCenterCrop(900, 1200, CARD_ASPECT);
    expect(crop).toEqual({ sx: 0, sy: 0, sWidth: 900, sHeight: 1200 });
  });
});
