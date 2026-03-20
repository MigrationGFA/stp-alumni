"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import userService from '../services/userService';
import useAuthStore from '../store/useAuthStore';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {

  const updateUser = useAuthStore((state) => state.updateUser);
  // Fetch full profile from API
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userService.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    onSuccess: (res) => {
      const profile = res?.data || res;
      if (profile) {
        updateUser({
          ...user,
          profileImagePath: profile.profileImagePath,
          sector: profile.sector,
          location: profile.location,
          skills: profile.skills,
          cohort: profile.cohort,
        });
      }
    },
  });


  return (
    <AuthContext.Provider value={{data:profileData,isProfileLoading}}>
      {children}
    </AuthContext.Provider>
  );
};


