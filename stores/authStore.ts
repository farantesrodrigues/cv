import {create} from 'zustand';
import { fetchTokens as fetchTokens, Tokens } from '../utils/authHelpers';


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

    // Avoid updating if the tokens haven't changed
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
  },

  clearTokens: () => {
    set({
      idToken: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });

  },

  loadTokens: async () => {
    const { loading } = get();
    // If already loading, do not proceed
    if (loading) {
      return;
    }

    set({ loading: true });

    try {
      const tokens: Tokens | null = await fetchTokens();

      if (tokens) {
        const { idToken, accessToken, refreshToken } = tokens;
        set({ idToken, accessToken, refreshToken, isAuthenticated: true });
      } else {
        set({ isAuthenticated: false });
      }

    } catch (error) {
      console.error('Error loading tokens:', error);
      set({ isAuthenticated: false });
    } finally {
      // Ensure loading state is reset in the end
      set({ loading: false });
    }
  },

}));