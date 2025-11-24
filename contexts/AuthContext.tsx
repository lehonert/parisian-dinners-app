
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, Subscription } from '../types';
import { currentUser } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUBSCRIPTION_PRICE = 197;
const SUBSCRIBER_DISCOUNT = 30;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and auto-login for demo
    console.log('AuthProvider: Initializing...');
    setTimeout(() => {
      console.log('AuthProvider: Setting user', currentUser);
      setUser(currentUser);
      setIsLoading(false);
    }, 500);
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Signing in with:', email);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUser(currentUser);
      setIsLoading(false);
    }, 1000);
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
    }, 1000);
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

  const hasActiveSubscription = (): boolean => {
    if (!user?.subscription) return false;
    
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    
    return user.subscription.status === 'active' && endDate > now;
  };

  const subscribeUser = async () => {
    console.log('Subscribing user to annual plan');
    if (!user) return;

    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const subscription: Subscription = {
      id: Date.now().toString(),
      userId: user.id,
      plan: 'annual',
      status: 'active',
      startDate: new Date(),
      endDate,
      price: SUBSCRIPTION_PRICE,
      paymentMethod: 'Carte bancaire',
      autoRenewal: true,
    };

    setUser({
      ...user,
      subscription,
    });
  };

  const getEventPrice = (basePrice: number): number => {
    if (hasActiveSubscription()) {
      return Math.max(0, basePrice - SUBSCRIBER_DISCOUNT);
    }
    return basePrice;
  };

  console.log('AuthProvider: Rendering, isLoading:', isLoading, 'user:', user?.name);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateProfile,
      hasActiveSubscription,
      subscribeUser,
      getEventPrice,
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
