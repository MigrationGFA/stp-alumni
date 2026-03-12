import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (userData, token) => {
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'lax' });
        set({ user: userData, token, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      // getStorage: () => localStorage, (default is localStorage)
    }
  )
);

export default useAuthStore;
