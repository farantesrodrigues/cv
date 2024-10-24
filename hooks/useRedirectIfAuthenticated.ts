import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../stores/authStore';

export const useRedirectIfAuthenticated = (redirectTo = '/fran') => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
  }));

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);

  return { isAuthenticated, loading };
};
