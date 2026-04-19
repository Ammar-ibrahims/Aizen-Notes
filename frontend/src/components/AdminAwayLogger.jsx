import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminAwayLogger() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const timeoutRef = useRef(null);

  useEffect(() => {
    // We only care if they are currently logged in
    if (!isAuthenticated) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    // If they leave the admin zone...
    if (!location.pathname.startsWith('/admin')) {
      timeoutRef.current = setTimeout(() => {
        logout();
      }, 5000);
    } else {
      // If they enter or return to the admin zone, cancel any active countdown
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    // Cleanup when component unmounts or before next effect runs
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, isAuthenticated, logout]);

  return null;
}
