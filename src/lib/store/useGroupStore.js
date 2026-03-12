import { create } from 'zustand';

export const useGroupStore = create((set) => ({
  groups: null,
  isLoading: false,
  error: null,

  setGroups: (data) => set({ groups: data }),
  setLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error }),
  
  // Optimistic UI toggle for membership changes
  toggleGroupMembershipLocally: (groupId, isMember) => 
    set((state) => ({
      groups: state.groups 
        ? state.groups.map(group => 
            group.groupId === groupId 
              ? { ...group, isMember, memberCount: isMember ? group.memberCount + 1 : group.memberCount - 1 }
              : group
          )
        : null
    })),
}));
