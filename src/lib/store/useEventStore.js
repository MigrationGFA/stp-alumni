import { create } from 'zustand';

export const useEventStore = create((set) => ({
  events: null,
  isLoading: false,
  error: null,

  setEvents: (data) => set({ events: data }),
  setLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error }),
}));
