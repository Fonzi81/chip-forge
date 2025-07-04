import { useEffect } from 'react';

interface KeyboardShortcuts {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onPanLeft?: () => void;
  onPanRight?: () => void;
  onToggleFullscreen?: () => void;
  onRunSimulation?: () => void;
  onStopSimulation?: () => void;
  onExportWaveform?: () => void;
  onClearLogs?: () => void;
  onFocusSearch?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const { ctrlKey, metaKey, shiftKey, key } = event;
      const modifier = ctrlKey || metaKey;

      // Zoom controls
      if (key === '+' || key === '=') {
        event.preventDefault();
        shortcuts.onZoomIn?.();
      } else if (key === '-') {
        event.preventDefault();
        shortcuts.onZoomOut?.();
      } else if (key === '0' && modifier) {
        event.preventDefault();
        shortcuts.onResetZoom?.();
      }

      // Pan controls
      else if (key === 'ArrowLeft' && shiftKey) {
        event.preventDefault();
        shortcuts.onPanLeft?.();
      } else if (key === 'ArrowRight' && shiftKey) {
        event.preventDefault();
        shortcuts.onPanRight?.();
      }

      // Simulation controls
      else if (key === 'Enter' && modifier) {
        event.preventDefault();
        shortcuts.onRunSimulation?.();
      } else if (key === 'Escape') {
        event.preventDefault();
        shortcuts.onStopSimulation?.();
      }

      // Export and utility
      else if (key === 's' && modifier && shiftKey) {
        event.preventDefault();
        shortcuts.onExportWaveform?.();
      } else if (key === 'l' && modifier) {
        event.preventDefault();
        shortcuts.onClearLogs?.();
      }

      // Focus search
      else if (key === 'f' && modifier) {
        event.preventDefault();
        shortcuts.onFocusSearch?.();
      }

      // Fullscreen toggle
      else if (key === 'F11') {
        event.preventDefault();
        shortcuts.onToggleFullscreen?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);

  // Return shortcut help text for UI display
  return {
    shortcuts: [
      { key: '+/-', description: 'Zoom in/out' },
      { key: 'Ctrl+0', description: 'Reset zoom' },
      { key: 'Shift+←/→', description: 'Pan left/right' },
      { key: 'Ctrl+Enter', description: 'Run simulation' },
      { key: 'Esc', description: 'Stop simulation' },
      { key: 'Ctrl+Shift+S', description: 'Export waveform' },
      { key: 'Ctrl+L', description: 'Clear logs' },
      { key: 'Ctrl+F', description: 'Focus search' },
      { key: 'F11', description: 'Toggle fullscreen' }
    ]
  };
};