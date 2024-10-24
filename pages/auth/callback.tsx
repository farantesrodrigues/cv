import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../../stores/authStore';
import { handleRedirect, Tokens } from '@/utils/authHelpers';

const Callback: React.FC = () => {
    const router = useRouter();
    const setTokens = useAuthStore((state) => state.setTokens);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const exchangeCodeForTokens = async (code: string) => {
        try {
          const tokens: Tokens | null = await handleRedirect(code);
          if (tokens) {
            const { idToken, accessToken, refreshToken } = tokens;
            // Use Zustand to store tokens in the state
            setTokens(idToken, accessToken, refreshToken);
            // Redirect to a protected page after successful login
            router.push('/fran');
          } else {
            setError('Authentication failed. Please try again.');
          }
        } catch (err) {
          console.error('Token exchange failed:', err);
          setError('Authentication failed. Please try again.');
        }
      };
  
      const code = router.query.code as string;
      if (code) {
        exchangeCodeForTokens(code);
      }
    }, [router, setTokens]);
  
    if (error) {
      return <div>{error}</div>;
    }
  
    return <div>Authenticating...</div>;
  };
  
  export default Callback;
