import { create } from 'zustand';

const useSignupStore = create((set) => ({
  signupData: {
    firstName: '',
    lastName: '',
    emailAddress: '',
  },
  setSignupData: (data) =>
    set((state) => ({ signupData: { ...state.signupData, ...data } })),
  clearSignupData: () =>
    set({ signupData: { firstName: '', lastName: '', emailAddress: '' } }),
}));

export default useSignupStore;
