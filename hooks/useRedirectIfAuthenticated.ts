import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../stores/authStore';

export const useRedirectIfAuthenticated = (redirectTo = '/fran') => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);

  return { isAuthenticated, loading };
};
