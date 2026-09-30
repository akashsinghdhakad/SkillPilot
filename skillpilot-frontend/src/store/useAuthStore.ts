import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  tenant_id: number | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setHasHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      tenant_id: null,
      isAuthenticated: false,
      hasHydrated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        if (user.tenant_id) {
          localStorage.setItem('tenant_id', user.tenant_id.toString());
        }
        set({ user, token, tenant_id: user.tenant_id, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tenant_id');
        set({ user: null, token: null, tenant_id: null, isAuthenticated: false });
      },
      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }
  )
);
