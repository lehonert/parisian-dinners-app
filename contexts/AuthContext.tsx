
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, Subscription } from '../types';
import { FirebaseService } from '../services/firebaseService';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  hasActiveSubscription: boolean;
  subscription: Subscription | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid);
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Récupérer les données utilisateur depuis Firestore
          const userData = await FirebaseService.getUser(firebaseUser.uid);
          if (userData) {
            setUser(userData);
            // Récupérer l'abonnement (simulation pour l'instant)
            setSubscription({
              id: 'sub_1',
              userId: firebaseUser.uid,
              plan: 'premium',
              status: 'active',
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
              price: 29.99
            });
          } else {
            // Créer un profil utilisateur de base s'il n'existe pas
            const newUser: Omit<User, 'id'> = {
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              bio: '',
              isAdmin: false,
              createdAt: new Date(),
              hasCompletedProfile: false
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser({ id: firebaseUser.uid, ...newUser });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setUser(null);
        setSubscription(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Créer le profil utilisateur dans Firestore
      const newUser: Omit<User, 'id'> = {
        email,
        name: '',
        photoURL: '',
        bio: '',
        isAdmin: false,
        createdAt: new Date(),
        hasCompletedProfile: false
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      console.log('Sign up successful');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // Note: Pour une implémentation complète avec Google Sign-In,
      // vous devrez installer et configurer @react-native-google-signin/google-signin
      // Pour l'instant, on simule juste l'erreur
      throw new Error('Google Sign-In nécessite une configuration supplémentaire');
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!firebaseUser || !user) {
      throw new Error('No authenticated user');
    }

    try {
      await FirebaseService.updateUser(firebaseUser.uid, profileData);
      setUser({ ...user, ...profileData });
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const hasActiveSubscription = subscription?.status === 'active' && 
    subscription?.endDate && subscription.endDate > new Date();

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut: signOutUser,
    updateProfile,
    hasActiveSubscription,
    subscription
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
