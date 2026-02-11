"use client";

import { createContext, useContext } from "react";

const AuthViewContext = createContext({ isPublicView: false });

export function AuthViewProvider({ children, isPublicView = false }) {
  return (
    <AuthViewContext.Provider value={{ isPublicView }}>
      {children}
    </AuthViewContext.Provider>
  );
}

export function useAuthView() {
  return useContext(AuthViewContext);
}
