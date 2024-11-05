import { create } from 'zustand';
import Cookies from 'js-cookie';
import { fetchTokens, Tokens, checkTokenExpiration, logout } from '../utils/authHelpers';

interface AuthState {
  idToken: string | undefined;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  loading: boolean;
  isAuthenticated: boolean;
  hasError: boolean;
  loadTokens: () => Promise<void>;
  setTokens: (idToken: string, accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  idToken: Cookies.get('idToken'),
  accessToken: Cookies.get('accessToken'),
  refreshToken: Cookies.get('refreshToken'),
  loading: false,
  isAuthenticated: !!Cookies.get('accessToken') && !checkTokenExpiration(Cookies.get('accessToken')!),
  hasError: false,

  setTokens: (idToken, accessToken, refreshToken) => {
    const { idToken: currentIdToken, accessToken: currentAccessToken, refreshToken: currentRefreshToken } = get();

    if (currentIdToken === idToken && currentAccessToken === accessToken && currentRefreshToken === refreshToken) {
      return;
    }

    set({
      idToken,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      hasError: false,
    });

    Cookies.set('idToken', idToken, { secure: true });
    Cookies.set('accessToken', accessToken, { secure: true });
    Cookies.set('refreshToken', refreshToken, { secure: true });
  },

  clearTokens: async () => {
    await logout();
    set({
      idToken: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      isAuthenticated: false,
      hasError: false,
    });
  },

  loadTokens: async () => {
    const { loading, setTokens } = get();
    if (loading) return;

    set({ loading: true, hasError: false });

    try {
      const idToken = Cookies.get('idToken');
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');

      if (idToken && accessToken && refreshToken) {
        const isTokenExpired = checkTokenExpiration(idToken);

        if (!isTokenExpired) {
          set({
            idToken,
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });
          set({ loading: false });
          return;
        }
      }

      const tokens = await fetchTokens();

      if (tokens) {
        const { idToken: newIdToken, accessToken: newAccessToken, refreshToken: newRefreshToken } = tokens;
        setTokens(newIdToken, newAccessToken, newRefreshToken);
      } else {
        set({ isAuthenticated: false, hasError: true });
      }
    } catch (error) {
      console.error('Error loading tokens:', error);

      set({ isAuthenticated: false, hasError: true });
    } finally {
      set({ loading: false });
    }
  },
}));
