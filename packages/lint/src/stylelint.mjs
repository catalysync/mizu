import noHexColor from './css/no-hex-color.mjs';
import varFallback from './css/var-fallback.mjs';

// Plugin list for a stylelint config. Rules are off until a config turns them on.
export const stylelintPlugins = [noHexColor, varFallback];

// Primary options: true reports at error level, 'warning' reports at warning level.
export const stylelintRules = {
  'mizu/no-hex-color': true,
  'mizu/var-fallback': 'warning',
};

export { noHexColor, varFallback };
