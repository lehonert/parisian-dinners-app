
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AuthContextType, User, Subscription } from '../types';
import { ErrorService } from '../services/errorService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid);
      
      if (firebaseUser) {
        try {
          await loadUserData(firebaseUser);
        } catch (error) {
          console.error('Error loading user data:', error);
          ErrorService.reportError(error, 'Failed to load user data');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      console.log('Loading user data for:', firebaseUser.uid);
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User document found:', userData);
        
        // Convert Firestore timestamps to Date objects
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: userData.name || firebaseUser.displayName || '',
          bio: userData.bio,
          photo: userData.photo || firebaseUser.photoURL,
          isAdmin: userData.isAdmin || false,
          createdAt: userData.createdAt?.toDate() || new Date(),
          subscription: userData.subscription ? {
            ...userData.subscription,
            startDate: userData.subscription.startDate?.toDate() || new Date(),
            endDate: userData.subscription.endDate?.toDate() || new Date(),
          } : undefined,
        };
        
        console.log('User data loaded successfully:', user.email);
        setUser(user);
      } else {
        console.log('User document does not exist, creating...');
        // Create user document if it doesn't exist (for Google sign-in)
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          photo: firebaseUser.photoURL || undefined,
          isAdmin: false,
          createdAt: new Date(),
        };
        
        await setDoc(userDocRef, {
          email: newUser.email,
          name: newUser.name,
          photo: newUser.photo,
          isAdmin: false,
          createdAt: serverTimestamp(),
        });
        
        console.log('User document created successfully');
        setUser(newUser);
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      setIsLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful for user:', userCredential.user.uid);
      
      // User data will be loaded by onAuthStateChanged
    } catch (error: any) {
      console.error('Sign in error:', error.code, error.message);
      
      let errorMessage = 'Une erreur est survenue lors de la connexion';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cet email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Ce compte a été désactivé';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erreur de connexion réseau. Vérifiez votre connexion internet';
      }
      
      ErrorService.reportError(error, 'Sign in failed');
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting to sign up with email:', email);
      setIsLoading(true);
      
      // Validate inputs
      if (!email || !password || !name) {
        throw new Error('Tous les champs sont requis');
      }
      
      if (password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }
      
      // Create user account
      console.log('Creating Firebase user...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Firebase user created successfully:', userCredential.user.uid);
      
      // Create user document in Firestore
      console.log('Creating user document in Firestore...');
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        email,
        name,
        isAdmin: false,
        createdAt: serverTimestamp(),
      });
      
      console.log('User document created successfully in Firestore');
      
      // User data will be loaded by onAuthStateChanged
    } catch (error: any) {
      console.error('Sign up error:', error.code, error.message);
      
      let errorMessage = 'Une erreur est survenue lors de l\'inscription';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'L\'inscription par email est désactivée. Veuillez contacter l\'administrateur';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erreur de connexion réseau. Vérifiez votre connexion internet';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      ErrorService.reportError(error, 'Sign up failed');
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await firebaseSignOut(auth);
      setUser(null);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      ErrorService.reportError(error, 'Sign out failed');
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }
      
      console.log('Updating profile:', data);
      
      const userDocRef = doc(db, 'users', user.id);
      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.photo !== undefined) updateData.photo = data.photo;
      if (data.isAdmin !== undefined) updateData.isAdmin = data.isAdmin;
      
      updateData.updatedAt = serverTimestamp();
      
      await updateDoc(userDocRef, updateData);
      
      // Update local state
      setUser({ ...user, ...data });
      
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      ErrorService.reportError(error, 'Profile update failed');
      throw error;
    }
  };

  const hasActiveSubscription = (): boolean => {
    if (!user?.subscription) {
      console.log('No subscription found');
      return false;
    }
    
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    
    const isActive = user.subscription.status === 'active' && endDate > now;
    console.log('Subscription active:', isActive);
    
    return isActive;
  };

  const subscribeUser = async (plan: 'monthly' | 'yearly') => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }
      
      console.log('Subscribing user to plan:', plan);
      
      const price = plan === 'monthly' ? 19.99 : 199.99;
      const startDate = new Date();
      const endDate = new Date();
      
      if (plan === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const subscription: Subscription = {
        id: `sub_${Date.now()}`,
        userId: user.id,
        plan,
        status: 'active',
        startDate,
        endDate,
        price,
        paymentMethod: 'Carte bancaire',
      };

      // Update user document with subscription
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        subscription: {
          id: subscription.id,
          userId: subscription.userId,
          plan: subscription.plan,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          price: subscription.price,
          paymentMethod: subscription.paymentMethod,
        },
        updatedAt: serverTimestamp(),
      });

      // Update local state
      setUser({
        ...user,
        subscription,
      });
      
      console.log('Subscription created successfully');
    } catch (error) {
      console.error('Subscribe error:', error);
      ErrorService.reportError(error, 'Subscription failed');
      throw error;
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
      hasActiveSubscription,
      subscribeUser,
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
