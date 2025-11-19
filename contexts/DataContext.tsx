
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePerformance } from '../hooks/usePerformance';
import { ErrorService } from '../services/errorService';
import { Event, Registration, Review, User } from '../types';
import { FirebaseService } from '../services/firebaseService';
import { useAuth } from './AuthContext';

interface DataContextType {
  events: Event[];
  loadingEvents: boolean;
  createEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'registeredCount' | 'waitlistCount'>) => Promise<void>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  registrations: Registration[];
  loadingRegistrations: boolean;
  registerForEvent: (eventId: string, userId: string) => Promise<void>;
  unregisterFromEvent: (eventId: string, userId: string) => Promise<void>;
  getUserRegistrations: (userId: string) => Registration[];
  reviews: Review[];
  loadingReviews: boolean;
  createReview: (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  approveReview: (reviewId: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  getEventReviews: (eventId: string) => Review[];
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const { user } = useAuth();
  const { trackOperation } = usePerformance();

  const loadEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const eventsData = await trackOperation('loadEvents', () => FirebaseService.getEvents());
      setEvents(eventsData);
      console.log('Events loaded:', eventsData.length);
    } catch (error) {
      console.error('Error loading events:', error);
      ErrorService.logError('DataContext', 'loadEvents', error);
    } finally {
      setLoadingEvents(false);
    }
  }, [trackOperation]);

  const loadRegistrations = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoadingRegistrations(true);
      const registrationsData = await trackOperation('loadRegistrations', () => 
        FirebaseService.getUserRegistrations(user.id)
      );
      setRegistrations(registrationsData);
      console.log('Registrations loaded:', registrationsData.length);
    } catch (error) {
      console.error('Error loading registrations:', error);
      ErrorService.logError('DataContext', 'loadRegistrations', error);
    } finally {
      setLoadingRegistrations(false);
    }
  }, [user, trackOperation]);

  const loadReviews = useCallback(async () => {
    try {
      setLoadingReviews(true);
      const reviewsData = await trackOperation('loadReviews', () => 
        FirebaseService.getAllPendingReviews()
      );
      setReviews(reviewsData);
      console.log('Reviews loaded:', reviewsData.length);
    } catch (error) {
      console.error('Error loading reviews:', error);
      ErrorService.logError('DataContext', 'loadReviews', error);
    } finally {
      setLoadingReviews(false);
    }
  }, [trackOperation]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (user) {
      loadRegistrations();
    }
  }, [user, loadRegistrations]);

  useEffect(() => {
    if (user?.isAdmin) {
      loadReviews();
    }
  }, [user?.isAdmin, loadReviews]);

  const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'registeredCount' | 'waitlistCount'>) => {
    try {
      await FirebaseService.createEvent(eventData);
      await loadEvents(); // Recharger les événements
      console.log('Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      ErrorService.logError('DataContext', 'createEvent', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      await FirebaseService.updateEvent(id, eventData);
      await loadEvents(); // Recharger les événements
      console.log('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      ErrorService.logError('DataContext', 'updateEvent', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await FirebaseService.deleteEvent(id);
      await loadEvents(); // Recharger les événements
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      ErrorService.logError('DataContext', 'deleteEvent', error);
      throw error;
    }
  };

  const registerForEvent = async (eventId: string, userId: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      const status = event.registeredCount >= event.capacity ? 'waitlist' : 'confirmed';
      await FirebaseService.registerForEvent(eventId, userId, status);
      
      // Recharger les données
      await Promise.all([loadEvents(), loadRegistrations()]);
      console.log('Registration successful');
    } catch (error) {
      console.error('Error registering for event:', error);
      ErrorService.logError('DataContext', 'registerForEvent', error);
      throw error;
    }
  };

  const unregisterFromEvent = async (eventId: string, userId: string) => {
    try {
      await FirebaseService.unregisterFromEvent(eventId, userId);
      
      // Recharger les données
      await Promise.all([loadEvents(), loadRegistrations()]);
      console.log('Unregistration successful');
    } catch (error) {
      console.error('Error unregistering from event:', error);
      ErrorService.logError('DataContext', 'unregisterFromEvent', error);
      throw error;
    }
  };

  const getUserRegistrations = (userId: string): Registration[] => {
    return registrations.filter(reg => reg.userId === userId);
  };

  const createReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    try {
      await FirebaseService.createReview(reviewData.eventId, reviewData);
      console.log('Review created successfully');
    } catch (error) {
      console.error('Error creating review:', error);
      ErrorService.logError('DataContext', 'createReview', error);
      throw error;
    }
  };

  const approveReview = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) {
        throw new Error('Review not found');
      }

      await FirebaseService.approveReview(review.eventId, reviewId);
      await loadReviews(); // Recharger les avis
      console.log('Review approved successfully');
    } catch (error) {
      console.error('Error approving review:', error);
      ErrorService.logError('DataContext', 'approveReview', error);
      throw error;
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) {
        throw new Error('Review not found');
      }

      await FirebaseService.deleteReview(review.eventId, reviewId);
      await loadReviews(); // Recharger les avis
      console.log('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      ErrorService.logError('DataContext', 'deleteReview', error);
      throw error;
    }
  };

  const getEventReviews = (eventId: string): Review[] => {
    return reviews.filter(review => review.eventId === eventId && review.status === 'approved');
  };

  const refreshData = async () => {
    await Promise.all([
      loadEvents(),
      user ? loadRegistrations() : Promise.resolve(),
      user?.isAdmin ? loadReviews() : Promise.resolve()
    ]);
  };

  const value: DataContextType = {
    events,
    loadingEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    registrations,
    loadingRegistrations,
    registerForEvent,
    unregisterFromEvent,
    getUserRegistrations,
    reviews,
    loadingReviews,
    createReview,
    approveReview,
    deleteReview,
    getEventReviews,
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
