
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Event, Registration, Review, User } from '../types';
import { mockEvents, mockRegistrations, mockReviews } from '../data/mockData';
import { ErrorService } from '../services/errorService';
import { usePerformance } from '../hooks/usePerformance';

interface DataContextType {
  // Events
  events: Event[];
  loadingEvents: boolean;
  createEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'registeredCount' | 'waitlistCount'>) => Promise<void>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  
  // Registrations
  registrations: Registration[];
  loadingRegistrations: boolean;
  registerForEvent: (eventId: string, userId: string) => Promise<void>;
  unregisterFromEvent: (eventId: string, userId: string) => Promise<void>;
  getUserRegistrations: (userId: string) => Registration[];
  
  // Reviews
  reviews: Review[];
  loadingReviews: boolean;
  createReview: (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  approveReview: (reviewId: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  getEventReviews: (eventId: string) => Review[];
  
  // General
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  const { measureAsync } = usePerformance();

  // Simulate API delay
  const simulateDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

  // Load initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('Loading initial data...');
        
        await measureAsync('loadInitialData', async () => {
          await simulateDelay(800);
          setEvents(mockEvents);
          setRegistrations(mockRegistrations);
          setReviews(mockReviews);
        });
        
      } catch (error) {
        console.error('Error loading initial data:', error);
        ErrorService.logError({
          code: 'data-load-error',
          message: 'Failed to load initial data',
          details: error,
          timestamp: new Date(),
        });
      } finally {
        setLoadingEvents(false);
        setLoadingRegistrations(false);
        setLoadingReviews(false);
      }
    };

    loadInitialData();
  }, [measureAsync]);

  // Event operations
  const createEvent = useCallback(async (eventData: Omit<Event, 'id' | 'createdAt' | 'registeredCount' | 'waitlistCount'>) => {
    try {
      console.log('Creating event:', eventData);
      
      await measureAsync('createEvent', async () => {
        await simulateDelay(500);
        
        const newEvent: Event = {
          ...eventData,
          id: Date.now().toString(),
          createdAt: new Date(),
          registeredCount: 0,
          waitlistCount: 0,
        };
        
        setEvents(prev => [newEvent, ...prev]);
      });
      
    } catch (error) {
      console.error('Error creating event:', error);
      ErrorService.handleEventError(error, 'création d\'événement');
      throw error;
    }
  }, [measureAsync]);

  const updateEvent = useCallback(async (id: string, eventData: Partial<Event>) => {
    try {
      console.log('Updating event:', id, eventData);
      
      await measureAsync('updateEvent', async () => {
        await simulateDelay(500);
        
        setEvents(prev => prev.map(event => 
          event.id === id ? { ...event, ...eventData } : event
        ));
      });
      
    } catch (error) {
      console.error('Error updating event:', error);
      ErrorService.handleEventError(error, 'modification d\'événement');
      throw error;
    }
  }, [measureAsync]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      console.log('Deleting event:', id);
      
      await measureAsync('deleteEvent', async () => {
        await simulateDelay(500);
        
        setEvents(prev => prev.filter(event => event.id !== id));
        setRegistrations(prev => prev.filter(reg => reg.eventId !== id));
        setReviews(prev => prev.filter(review => review.eventId !== id));
      });
      
    } catch (error) {
      console.error('Error deleting event:', error);
      ErrorService.handleEventError(error, 'suppression d\'événement');
      throw error;
    }
  }, [measureAsync]);

  // Registration operations
  const registerForEvent = useCallback(async (eventId: string, userId: string) => {
    try {
      console.log('Registering for event:', eventId, userId);
      
      await measureAsync('registerForEvent', async () => {
        await simulateDelay(500);
        
        const event = events.find(e => e.id === eventId);
        if (!event) {
          throw { code: 'event/not-found', message: 'Event not found' };
        }
        
        const existingRegistration = registrations.find(
          reg => reg.eventId === eventId && reg.userId === userId
        );
        
        if (existingRegistration) {
          throw { code: 'event/already-registered', message: 'Already registered' };
        }
        
        const confirmedRegistrations = registrations.filter(
          reg => reg.eventId === eventId && reg.status === 'confirmed'
        ).length;
        
        const status = confirmedRegistrations >= event.capacity ? 'waitlist' : 'confirmed';
        
        const newRegistration: Registration = {
          id: Date.now().toString(),
          userId,
          eventId,
          status,
          registeredAt: new Date(),
        };
        
        setRegistrations(prev => [...prev, newRegistration]);
        
        // Update event counts
        setEvents(prev => prev.map(e => {
          if (e.id === eventId) {
            return {
              ...e,
              registeredCount: status === 'confirmed' ? e.registeredCount + 1 : e.registeredCount,
              waitlistCount: status === 'waitlist' ? e.waitlistCount + 1 : e.waitlistCount,
            };
          }
          return e;
        }));
      });
      
    } catch (error) {
      console.error('Error registering for event:', error);
      ErrorService.handleEventError(error, 'inscription à l\'événement');
      throw error;
    }
  }, [events, registrations, measureAsync]);

  const unregisterFromEvent = useCallback(async (eventId: string, userId: string) => {
    try {
      console.log('Unregistering from event:', eventId, userId);
      
      await measureAsync('unregisterFromEvent', async () => {
        await simulateDelay(500);
        
        const registration = registrations.find(
          reg => reg.eventId === eventId && reg.userId === userId
        );
        
        if (!registration) {
          throw { code: 'registration/not-found', message: 'Registration not found' };
        }
        
        setRegistrations(prev => prev.filter(
          reg => !(reg.eventId === eventId && reg.userId === userId)
        ));
        
        // Update event counts
        setEvents(prev => prev.map(e => {
          if (e.id === eventId) {
            return {
              ...e,
              registeredCount: registration.status === 'confirmed' ? e.registeredCount - 1 : e.registeredCount,
              waitlistCount: registration.status === 'waitlist' ? e.waitlistCount - 1 : e.waitlistCount,
            };
          }
          return e;
        }));
      });
      
    } catch (error) {
      console.error('Error unregistering from event:', error);
      ErrorService.handleEventError(error, 'désinscription de l\'événement');
      throw error;
    }
  }, [registrations, measureAsync]);

  const getUserRegistrations = useCallback((userId: string) => {
    return registrations.filter(reg => reg.userId === userId);
  }, [registrations]);

  // Review operations
  const createReview = useCallback(async (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    try {
      console.log('Creating review:', reviewData);
      
      await measureAsync('createReview', async () => {
        await simulateDelay(500);
        
        const newReview: Review = {
          ...reviewData,
          id: Date.now().toString(),
          createdAt: new Date(),
          status: 'pending',
        };
        
        setReviews(prev => [...prev, newReview]);
      });
      
    } catch (error) {
      console.error('Error creating review:', error);
      ErrorService.logError({
        code: 'review-create-error',
        message: 'Failed to create review',
        details: error,
        timestamp: new Date(),
      });
      throw error;
    }
  }, [measureAsync]);

  const approveReview = useCallback(async (reviewId: string) => {
    try {
      console.log('Approving review:', reviewId);
      
      await measureAsync('approveReview', async () => {
        await simulateDelay(300);
        
        setReviews(prev => prev.map(review =>
          review.id === reviewId ? { ...review, status: 'approved' as const } : review
        ));
      });
      
    } catch (error) {
      console.error('Error approving review:', error);
      ErrorService.logError({
        code: 'review-approve-error',
        message: 'Failed to approve review',
        details: error,
        timestamp: new Date(),
      });
      throw error;
    }
  }, [measureAsync]);

  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      console.log('Deleting review:', reviewId);
      
      await measureAsync('deleteReview', async () => {
        await simulateDelay(300);
        
        setReviews(prev => prev.filter(review => review.id !== reviewId));
      });
      
    } catch (error) {
      console.error('Error deleting review:', error);
      ErrorService.logError({
        code: 'review-delete-error',
        message: 'Failed to delete review',
        details: error,
        timestamp: new Date(),
      });
      throw error;
    }
  }, [measureAsync]);

  const getEventReviews = useCallback((eventId: string) => {
    return reviews.filter(review => review.eventId === eventId && review.status === 'approved');
  }, [reviews]);

  const refreshData = useCallback(async () => {
    console.log('Refreshing all data...');
    setLoadingEvents(true);
    setLoadingRegistrations(true);
    setLoadingReviews(true);
    
    try {
      await measureAsync('refreshData', async () => {
        await simulateDelay(800);
        setEvents(mockEvents);
        setRegistrations(mockRegistrations);
        setReviews(mockReviews);
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      ErrorService.logError({
        code: 'data-refresh-error',
        message: 'Failed to refresh data',
        details: error,
        timestamp: new Date(),
      });
    } finally {
      setLoadingEvents(false);
      setLoadingRegistrations(false);
      setLoadingReviews(false);
    }
  }, [measureAsync]);

  const value: DataContextType = {
    // Events
    events,
    loadingEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    
    // Registrations
    registrations,
    loadingRegistrations,
    registerForEvent,
    unregisterFromEvent,
    getUserRegistrations,
    
    // Reviews
    reviews,
    loadingReviews,
    createReview,
    approveReview,
    deleteReview,
    getEventReviews,
    
    // General
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
