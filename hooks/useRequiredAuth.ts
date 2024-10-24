import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../stores/authStore';

export const useRequireAuth = (redirectTo = '/signin') => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const loadTokens = useAuthStore((state) => state.loadTokens);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      // Only load tokens if not authenticated
      loadTokens().then(() => {
        // Check if authentication status changed after loading tokens
        if (!useAuthStore.getState().isAuthenticated) {
          router.push(redirectTo);
        }
      });
    }
  }, [isAuthenticated, loading, loadTokens, router, redirectTo]);

  return useMemo(() => ({ isAuthenticated, loading }), [isAuthenticated, loading]);
};
