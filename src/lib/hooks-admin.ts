'use client';

import { useState, useCallback } from 'react';

export function useAdminAuth() {
  const [isAdmin] = useState(true);
  const [isLoading] = useState(false);
  const [userRole] = useState<string | null>('admin');
  const [userEmail] = useState<string | null>('admin@foodiehub.com');

  const checkAdminAuth = useCallback(async () => {
    return true;
  }, []);

  const signOut = useCallback(async () => {
    // No-op when auth is disabled
  }, []);

  return { isAdmin, isLoading, userRole, userEmail, checkAdminAuth, signOut };
}
