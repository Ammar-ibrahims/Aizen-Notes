import { useEffect, useRef } from 'react';

export function useIdleTimeout(onTimeout, timeoutMs = 5000) {
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      lastActivity.current = Date.now();
    };

    // Attach listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Watcher interval checking the absolute system clock
    const intervalId = setInterval(() => {
      if (Date.now() - lastActivity.current >= timeoutMs) {
        onTimeout();
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      clearInterval(intervalId);
    };
  }, [onTimeout, timeoutMs]);
}
