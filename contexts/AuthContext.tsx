
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AuthContextType, User, Subscription } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUBSCRIPTION_PRICE = 197;
const SUBSCRIBER_DISCOUNT = 30;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up Firebase auth listener');
    
    // Écouter les changements d'état d'authentification
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('Auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        try {
          // Récupérer les données utilisateur depuis Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const appUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: userData.name || '',
              photoURL: userData.photoURL,
              bio: userData.bio,
              phone: userData.phone,
              profession: userData.profession,
              howDidYouHear: userData.howDidYouHear,
              isAdmin: userData.isAdmin || false,
              createdAt: userData.createdAt?.toDate() || new Date(),
              hasCompletedProfile: userData.hasCompletedProfile || false,
              subscription: userData.subscription ? {
                ...userData.subscription,
                startDate: userData.subscription.startDate?.toDate(),
                endDate: userData.subscription.endDate?.toDate(),
              } : undefined,
            };
            console.log('User data loaded from Firestore:', appUser.name);
            setUser(appUser);
          } else {
            console.log('User document does not exist in Firestore');
            // Créer un document utilisateur basique
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              isAdmin: false,
              createdAt: new Date(),
              hasCompletedProfile: false,
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              email: newUser.email,
              name: newUser.name,
              isAdmin: false,
              createdAt: new Date(),
              hasCompletedProfile: false,
            });
            
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setUser(null);
        }
      } else {
        console.log('No user signed in');
        setUser(null);
      }
      
      setIsLoading(false);
    });

    // Cleanup
    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Signing in with:', email);
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', userCredential.user.email);
      // L'état sera mis à jour par onAuthStateChanged
    } catch (error: any) {
      console.error('Sign in error:', error);
      setIsLoading(false);
      
      // Messages d'erreur en français
      let errorMessage = 'Erreur de connexion';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Adresse email invalide';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Ce compte a été désactivé';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cet email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email ou mot de passe incorrect';
      }
      
      throw new Error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.log('Signing up with:', email, name);
    setIsLoading(true);
    
    try {
      // Créer le compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign up successful:', userCredential.user.email);
      
      // Créer le document utilisateur dans Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        name,
        isAdmin: false,
        createdAt: new Date(),
        hasCompletedProfile: false,
      });
      
      console.log('User document created in Firestore');
      // L'état sera mis à jour par onAuthStateChanged
    } catch (error: any) {
      console.error('Sign up error:', error);
      setIsLoading(false);
      
      // Messages d'erreur en français
      let errorMessage = 'Erreur lors de l\'inscription';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Adresse email invalide';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'L\'inscription par email est désactivée';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    console.log('Signing out');
    try {
      await firebaseSignOut(auth);
      console.log('Sign out successful');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    console.log('Updating profile:', data);
    if (!user) {
      throw new Error('No user signed in');
    }
    
    try {
      // Mettre à jour Firestore
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date(),
      });
      
      console.log('Profile updated in Firestore');
      
      // Mettre à jour l'état local
      setUser({ ...user, ...data });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
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
    if (!user) {
      throw new Error('No user signed in');
    }

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

    try {
      // Mettre à jour Firestore
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        subscription: {
          ...subscription,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
        },
        updatedAt: new Date(),
      });
      
      console.log('Subscription updated in Firestore');
      
      // Mettre à jour l'état local
      setUser({
        ...user,
        subscription,
      });
    } catch (error) {
      console.error('Subscribe user error:', error);
      throw error;
    }
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
