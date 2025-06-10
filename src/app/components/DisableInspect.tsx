// components/DisableInspect.tsx
'use client';

import { useEffect } from 'react';

export default function DisableInspect() {
  useEffect(() => {
    // Disable right-click
    const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', disableContextMenu);

    // Disable keyboard shortcuts
    const disableShortcuts = (e: KeyboardEvent) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || // Ctrl+Shift+I/J/C
        (e.ctrlKey && e.key === 'u') // Ctrl+U
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', disableShortcuts);

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableShortcuts);
    };
  }, []);

  return null;
}
