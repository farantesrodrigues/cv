
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../stores/authStore';

export const useRequireAuth = (redirectTo = '/') => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const loadTokens = useAuthStore((state) => state.loadTokens);
  const hasError = useAuthStore((state) => state.hasError);

  const [tokensChecked, setTokensChecked] = useState(false);

  useEffect(() => {
    if (!tokensChecked && !loading) {
      loadTokens()
        .then(() => setTokensChecked(true))
        .catch(() => setTokensChecked(true));
    }
  }, [tokensChecked, loading, loadTokens]);

  useEffect(() => {
    if (tokensChecked && !loading && !isAuthenticated) {
      router.push(redirectTo);
    } else if (hasError) {
      router.push(redirectTo);
    }
  }, [tokensChecked, loading, isAuthenticated, hasError, router, redirectTo]);

  return { isAuthenticated, loading, hasError };
};