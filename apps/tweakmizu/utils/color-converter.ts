import * as culori from 'culori';
import { Hsl } from 'culori';
import { ColorFormat } from '../types';

const formatNumber = (num?: number) => {
  if (!num) return '0';
  return num % 1 === 0 ? num : num.toFixed(4);
};

export const formatHsl = (hsl: Hsl) => {
  return `hsl(${formatNumber(hsl.h)} ${formatNumber(hsl.s * 100)}% ${formatNumber(hsl.l * 100)}%)`;
};

export const colorFormatter = (colorValue: string, format: ColorFormat = 'hex'): string => {
  try {
    const color = culori.parse(colorValue);
    if (!color) throw new Error('Invalid color input');

    switch (format) {
      case 'hsl': {
        const hsl = culori.converter('hsl')(color);
        return formatHsl(hsl);
      }
      case 'rgb':
        return culori.formatRgb(color);
      case 'oklch': {
        const oklch = culori.converter('oklch')(color);
        return `oklch(${formatNumber(oklch.l)} ${formatNumber(oklch.c)} ${formatNumber(oklch.h)})`;
      }
      case 'hex':
        return culori.formatHex(color);
      default:
        return colorValue;
    }
  } catch {
    return colorValue;
  }
};
