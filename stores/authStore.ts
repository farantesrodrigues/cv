import { create } from 'zustand';
import Cookies from 'js-cookie';
import { fetchTokens, Tokens, checkTokenExpiration, clearTokens } from '../utils/authHelpers';

interface AuthState {
  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  loadTokens: () => Promise<void>;
  setTokens: (idToken: string, accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  idToken: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  isAuthenticated: false,

  setTokens: (idToken, accessToken, refreshToken) => {
    const { idToken: currentIdToken, accessToken: currentAccessToken, refreshToken: currentRefreshToken } = get();

    if (
      currentIdToken === idToken &&
      currentAccessToken === accessToken &&
      currentRefreshToken === refreshToken
    ) {
      return;
    }

    set({
      idToken,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });

    // Persist tokens in cookies
    Cookies.set('idToken', idToken);
    Cookies.set('accessToken', accessToken);
    Cookies.set('refreshToken', refreshToken);
  },

  clearTokens: async () => {
    await clearTokens();

    set({
      idToken: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  loadTokens: async () => {
    const { loading, setTokens } = get();
    if (loading) {
      return;
    }

    set({ loading: true });

    try {
      // Attempt to load tokens from cookies
      const idToken = Cookies.get('idToken');
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');

      if (idToken && accessToken && refreshToken) {
        const isTokenExpired = checkTokenExpiration(idToken);

        if (!isTokenExpired) {
          set({ idToken, accessToken, refreshToken, isAuthenticated: true });
          set({ loading: false });
          return;
        }
      }

      // If tokens are not present or expired, fetch new ones
      const tokens: Tokens | null = await fetchTokens();

      if (tokens) {
        const { idToken: newIdToken, accessToken: newAccessToken, refreshToken: newRefreshToken } = tokens;
        setTokens(newIdToken, newAccessToken, newRefreshToken);
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
      set({ isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },
}));
