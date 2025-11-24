
export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  photo?: string;
  isAdmin: boolean;
  createdAt: Date;
  subscription?: Subscription;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'annual';
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  price: number;
  paymentMethod?: string;
  autoRenewal: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  chef: string;
  image: string;
  date: Date;
  location: string;
  capacity: number;
  price: number;
  ratingAvg: number;
  ratingCount: number;
  createdBy: string;
  createdAt: Date;
  registeredCount: number;
  waitlistCount: number;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  status: 'confirmed' | 'waitlist';
  registeredAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved';
  createdAt: Date;
  userName: string;
  userPhoto?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  hasActiveSubscription: () => boolean;
  subscribeUser: () => Promise<void>;
  getEventPrice: (basePrice: number) => number;
}
