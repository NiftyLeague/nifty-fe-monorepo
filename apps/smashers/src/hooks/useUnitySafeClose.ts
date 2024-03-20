import { useCallback, useEffect } from 'react';

type HookProps = { closeGame: () => void; unload: () => Promise<void> };

const useUnitySafeClose = ({ closeGame, unload }: HookProps) => {
  const handleLeavePage = useCallback(async () => {
    await unload();
    // Ready to navigate to another page.
    closeGame();
  }, [unload, closeGame]);

  const handleCloseEvent = useCallback(
    (e: Event) => {
      const closeBtn = document.getElementById('unity-close-icon');
      const modal = document.getElementById('unity-modal');
      if (e.target === modal || e.target === closeBtn) handleLeavePage();
    },
    [handleLeavePage],
  );

  useEffect(() => {
    const closeBtn = document.getElementById('unity-close-icon');
    const modal = document.getElementById('unity-modal');

    modal?.addEventListener('click', handleCloseEvent);
    closeBtn?.addEventListener('click', handleCloseEvent);

    return function cleanup() {
      modal?.removeEventListener('click', handleCloseEvent);
      closeBtn?.removeEventListener('click', handleCloseEvent);
    };
  }, [handleCloseEvent]);
};

export default useUnitySafeClose;
