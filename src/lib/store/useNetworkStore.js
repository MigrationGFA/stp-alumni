import { create } from 'zustand';

const useNetworkStore = create((set) => ({
  networkUsers: [],
  sameSkillUsers: [],
  sameSectorUsers: [],
  myConnections: [],
  options: {
    isLoading: true,
    error: null,
  },
  
  setNetworkData: (data) =>
    set(() => ({
      networkUsers: data || [],
      sameSkillUsers: data.sameSkillUsers || [],
      sameSectorUsers: data.sameSectorUsers || [],
      myConnections: data.connections || [],
      options: { isLoading: false, error: null },
    })),
    
  setLoading: (isLoading) =>
    set((state) => ({ options: { ...state.options, isLoading } })),
    
  setError: (error) =>
    set((state) => ({ options: { ...state.options, error, isLoading: false } })),
}));

export default useNetworkStore;
