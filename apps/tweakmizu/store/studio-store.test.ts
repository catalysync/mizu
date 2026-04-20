import { defaultStudioExtensions } from '@/config/studio';
import { defaultThemeState } from '@/config/theme';
import { beforeEach, describe, expect, it } from 'vitest';
import { useStudioStore } from './studio-store';

describe('useStudioStore', () => {
  beforeEach(() => {
    useStudioStore.setState({
      studioState: {
        ...defaultThemeState,
        extensions: structuredClone(defaultStudioExtensions),
      },
      studioCheckpoint: null,
      history: [],
      future: [],
    });
  });

  it('initializes with default extensions', () => {
    const { studioState } = useStudioStore.getState();
    expect(studioState.extensions).toEqual(defaultStudioExtensions);
  });

  it('setExtensions updates density mode and creates history entry', () => {
    const { setExtensions } = useStudioStore.getState();
    setExtensions((prev) => ({
      ...prev,
      density: { ...prev.density, mode: 'compact', spacingMultiplier: 0.75 },
    }));

    const state = useStudioStore.getState();
    expect(state.studioState.extensions.density.mode).toBe('compact');
    expect(state.studioState.extensions.density.spacingMultiplier).toBe(0.75);
    expect(state.history.length).toBe(1);
  });

  it('undo restores the previous extensions', () => {
    const { setExtensions, undo } = useStudioStore.getState();
    setExtensions((prev) => ({
      ...prev,
      density: { ...prev.density, mode: 'spacious', spacingMultiplier: 1.25 },
    }));

    expect(useStudioStore.getState().studioState.extensions.density.mode).toBe('spacious');

    undo();

    expect(useStudioStore.getState().studioState.extensions.density.mode).toBe('default');
  });

  it('redo re-applies an undone change', () => {
    const { setExtensions, undo, redo } = useStudioStore.getState();
    setExtensions((prev) => ({
      ...prev,
      density: { ...prev.density, mode: 'compact' },
    }));

    undo();
    expect(useStudioStore.getState().studioState.extensions.density.mode).toBe('default');

    redo();
    expect(useStudioStore.getState().studioState.extensions.density.mode).toBe('compact');
  });

  it('saveCheckpoint + restoreCheckpoint work as a snapshot pair', () => {
    const { setExtensions, saveCheckpoint, restoreCheckpoint } = useStudioStore.getState();
    setExtensions((prev) => ({
      ...prev,
      layout: { ...prev.layout, stack: { ...prev.layout.stack, gap: '2rem' } },
    }));
    saveCheckpoint();

    setExtensions((prev) => ({
      ...prev,
      layout: { ...prev.layout, stack: { ...prev.layout.stack, gap: '0.5rem' } },
    }));
    expect(useStudioStore.getState().studioState.extensions.layout.stack.gap).toBe('0.5rem');

    restoreCheckpoint();
    expect(useStudioStore.getState().studioState.extensions.layout.stack.gap).toBe('2rem');
  });

  it('resetExtensions reverts all studio extensions to defaults', () => {
    const { setExtensions, resetExtensions } = useStudioStore.getState();
    setExtensions((prev) => ({
      ...prev,
      density: { ...prev.density, mode: 'compact' },
    }));
    resetExtensions();

    expect(useStudioStore.getState().studioState.extensions).toEqual(defaultStudioExtensions);
  });

  it('canUndo / canRedo reflect history state', () => {
    const { setExtensions, undo } = useStudioStore.getState();
    expect(useStudioStore.getState().canUndo()).toBe(false);

    setExtensions((prev) => ({
      ...prev,
      density: { ...prev.density, mode: 'spacious' },
    }));
    expect(useStudioStore.getState().canUndo()).toBe(true);
    expect(useStudioStore.getState().canRedo()).toBe(false);

    undo();
    expect(useStudioStore.getState().canRedo()).toBe(true);
  });
});
