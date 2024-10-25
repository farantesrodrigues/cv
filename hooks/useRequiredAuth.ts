import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../stores/authStore';

export const useRequireAuth = (redirectTo = '/signin') => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const loadTokens = useAuthStore((state) => state.loadTokens);

  // Local state to track if tokens have been checked
  const [tokensChecked, setTokensChecked] = useState(false);

  useEffect(() => {
    // If tokens haven't been checked and we're not currently loading, attempt to load them
    if (!tokensChecked && !loading) {
      loadTokens().then(() => setTokensChecked(true));
    }
  }, [tokensChecked, loading, loadTokens]);

  useEffect(() => {
    // If authentication check is complete and user is not authenticated, redirect to the sign-in page
    if (tokensChecked && !loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [tokensChecked, loading, isAuthenticated, router, redirectTo]);

  return { isAuthenticated, loading };
};
