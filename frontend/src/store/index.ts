import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasHydrated: (v: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      hasHydrated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      logout: () => {
        // Also clear the JWT so a stale token can't linger
        try {
          localStorage.removeItem('auth_token');
        } catch {
          /* ignore */
        }
        set({ user: null, isAuthenticated: false, error: null });
      },
    }),
    {
      name: 'lessonshub-auth',
      // Only persist the session identity, not transient UI flags
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }) as AuthStore,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

interface UIStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

/**
 * The drawer starts open so the desktop layout paints with navigation visible.
 *
 * This must be a constant rather than a `window.matchMedia()` check: the value
 * is rendered during SSR, where `window` does not exist, so reading it here
 * would produce different server and client markup and break hydration.
 * AppShell closes the drawer on phone-sized viewports instead.
 */
const SIDEBAR_OPEN_BY_DEFAULT = true;

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: SIDEBAR_OPEN_BY_DEFAULT,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
