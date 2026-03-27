import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isOnboarded: false,
      passwordChangeRequired: false,

      login: (userData, token) => {
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'lax' });
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isOnboarded: userData?.isOnboarded ?? false,
          passwordChangeRequired: userData?.passwordChangeRequired ?? false,
        });
      },

      setOnboarded: (value) => set({ isOnboarded: value }),

      logout: () => {
        Cookies.remove('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isOnboarded: false,
          passwordChangeRequired: false,
        });
        // Clear messaging state on logout
        try {
          const { default: useMessagingStore } = require('../store/useMessagingStore');
          useMessagingStore.getState().reset();
        } catch {
          // Messaging store may not be loaded yet — safe to ignore
        }
      },

      updateUser: (data) =>
        set((state) => ({
          user: { ...state.user, ...data },
          // Sync top-level flags if they come back in an update
          ...(data.isOnboarded !== undefined && { isOnboarded: data.isOnboarded }),
          ...(data.passwordChangeRequired !== undefined && { passwordChangeRequired: data.passwordChangeRequired }),
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
