import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { handleRedirect } from '@/utils/authHelpers';
import { useAuthStore } from '@/stores/authStore';

const Callback = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const setTokens = useAuthStore((state) => state.setTokens);

  useEffect(() => {
    const exchangeCodeForTokens = async () => {
      const code = router.query.code as string;
      if (code) {
        try {
          const tokens = await handleRedirect(code);

          // Check if tokens are present
          if (tokens && tokens.idToken && tokens.accessToken && tokens.refreshToken) {
            setTokens(tokens.idToken, tokens.accessToken, tokens.refreshToken)
            router.push('/fran');
          } else {
            // Handle case where tokens are missing
            setError('Authentication failed. Please try again.');
            console.error('Missing tokens:', tokens);
          }
        } catch (err) {
          setError('Authentication failed. Please try again.');
          console.error('Token exchange failed:', err);
        }
      }
    };

    exchangeCodeForTokens();
  }, [router.query.code]);

  return error ? <div>{error}</div> : <div>Authenticating...</div>;
};

export default Callback;
