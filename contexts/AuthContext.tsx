
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { currentUser } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and auto-login for demo
    setTimeout(() => {
      setUser(currentUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Signing in with:', email);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUser(currentUser);
      setIsLoading(false);
    }, 1500);
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.log('Signing up with:', email, name);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        isAdmin: false,
        createdAt: new Date(),
      };
      setUser(newUser);
      setIsLoading(false);
    }, 1500);
  };

  const signOut = async () => {
    console.log('Signing out');
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    console.log('Updating profile:', data);
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
