

// context/NavbarContext.jsx
'use client';

import React, { createContext, useState, useContext } from 'react';

const NavbarContext = createContext();

export function NavbarProvider({ children }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [userSize, setUserSize] = useState({ width: 0, height: 0 });
  
  return (
    <NavbarContext.Provider value={{ size,userSize, setSize,setUserSize }}>
      {children}
    </NavbarContext.Provider>
  );
}

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within NavbarProvider');
  }
  return context;
};