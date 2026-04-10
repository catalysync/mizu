import { ThemeStyleProps } from './theme';

export interface ThemeEditorState {
  /** Currently selected preset name, or undefined if custom */
  preset?: string;
  /** Full resolved styles (base defaults merged with preset overrides) */
  styles: ThemeStyleProps;
  /** Current color mode (light or dark) */
  currentMode: 'light' | 'dark';
}
