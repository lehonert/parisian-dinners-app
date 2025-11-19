
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Event, Registration, Review, User } from '../types';
import { FirebaseService } from '../services/firebaseService';
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
  approveReview: (reviewId: string, eventId: string) => Promise<void>;
  deleteReview: (reviewId: string, eventId: string) => Promise<void>;
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

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      console.log('Loading initial data from Firebase...');
      
      await measureAsync('loadInitialData', async () => {
        // Load events
        try {
          const eventsData = await FirebaseService.getEvents();
          console.log('Events loaded:', eventsData.length);
          setEvents(eventsData);
        } catch (error) {
          console.error('Error loading events:', error);
          setEvents([]);
        }
        
        // Load all registrations (for admin view)
        // In production, you might want to load only user-specific registrations
        setRegistrations([]);
        
        // Load all reviews
        setReviews([]);
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
  }, [measureAsync]);

  // Event operations
  const createEvent = useCallback(async (eventData: Omit<Event, 'id' | 'createdAt' | 'registeredCount' | 'waitlistCount'>) => {
    try {
      console.log('Creating event:', eventData.title);
      
      await measureAsync('createEvent', async () => {
        const eventId = await FirebaseService.createEvent(eventData);
        
        // Reload events to get the new event
        const updatedEvents = await FirebaseService.getEvents();
        setEvents(updatedEvents);
      });
      
    } catch (error) {
      console.error('Error creating event:', error);
      ErrorService.handleEventError(error, 'création d\'événement');
      throw error;
    }
  }, [measureAsync]);

  const updateEvent = useCallback(async (id: string, eventData: Partial<Event>) => {
    try {
      console.log('Updating event:', id);
      
      await measureAsync('updateEvent', async () => {
        await FirebaseService.updateEvent(id, eventData);
        
        // Update local state
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
        await FirebaseService.deleteEvent(id);
        
        // Update local state
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
        const event = events.find(e => e.id === eventId);
        if (!event) {
          throw { code: 'event/not-found', message: 'Event not found' };
        }
        
        // Check if already registered
        const userRegs = await FirebaseService.getUserRegistrations(userId);
        const existingRegistration = userRegs.find(reg => reg.eventId === eventId);
        
        if (existingRegistration) {
          throw { code: 'event/already-registered', message: 'Already registered' };
        }
        
        // Determine status based on capacity
        const status = event.registeredCount >= event.capacity ? 'waitlist' : 'confirmed';
        
        await FirebaseService.registerForEvent(eventId, userId, status);
        
        // Reload events to get updated counts
        const updatedEvents = await FirebaseService.getEvents();
        setEvents(updatedEvents);
        
        // Reload user registrations
        const updatedRegs = await FirebaseService.getUserRegistrations(userId);
        setRegistrations(updatedRegs);
      });
      
    } catch (error) {
      console.error('Error registering for event:', error);
      ErrorService.handleEventError(error, 'inscription à l\'événement');
      throw error;
    }
  }, [events, measureAsync]);

  const unregisterFromEvent = useCallback(async (eventId: string, userId: string) => {
    try {
      console.log('Unregistering from event:', eventId, userId);
      
      await measureAsync('unregisterFromEvent', async () => {
        await FirebaseService.unregisterFromEvent(eventId, userId);
        
        // Reload events to get updated counts
        const updatedEvents = await FirebaseService.getEvents();
        setEvents(updatedEvents);
        
        // Update local registrations
        setRegistrations(prev => prev.filter(
          reg => !(reg.eventId === eventId && reg.userId === userId)
        ));
      });
      
    } catch (error) {
      console.error('Error unregistering from event:', error);
      ErrorService.handleEventError(error, 'désinscription de l\'événement');
      throw error;
    }
  }, [measureAsync]);

  const getUserRegistrations = useCallback((userId: string) => {
    return registrations.filter(reg => reg.userId === userId);
  }, [registrations]);

  // Review operations
  const createReview = useCallback(async (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    try {
      console.log('Creating review for event:', reviewData.eventId);
      
      await measureAsync('createReview', async () => {
        await FirebaseService.createReview(reviewData.eventId, reviewData);
        
        // Reload reviews for this event
        const eventReviews = await FirebaseService.getEventReviews(reviewData.eventId);
        
        // Update local state
        setReviews(prev => {
          const filtered = prev.filter(r => r.eventId !== reviewData.eventId);
          return [...filtered, ...eventReviews];
        });
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

  const approveReview = useCallback(async (reviewId: string, eventId: string) => {
    try {
      console.log('Approving review:', reviewId);
      
      await measureAsync('approveReview', async () => {
        await FirebaseService.approveReview(eventId, reviewId);
        
        // Update local state
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

  const deleteReview = useCallback(async (reviewId: string, eventId: string) => {
    try {
      console.log('Deleting review:', reviewId);
      
      await measureAsync('deleteReview', async () => {
        await FirebaseService.deleteReview(eventId, reviewId);
        
        // Update local state
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
    
    await loadInitialData();
  }, [loadInitialData]);

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
