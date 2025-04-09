import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ 
    id: 'guest-' + Math.random().toString(36).substring(2, 9),
    username: 'Guest User'
  });
  
  // Simple value with just the guest user
  const value = {
    user,
    loading: false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 