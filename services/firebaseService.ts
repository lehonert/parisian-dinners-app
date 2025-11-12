
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event, User, Registration, Review } from '../types';

export class FirebaseService {
  // Helper to convert Firestore timestamps to Date
  private static convertTimestamp(timestamp: any): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (timestamp?.toDate) {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    return new Date(timestamp);
  }

  // Users
  static async createUser(userId: string, userData: Omit<User, 'id'>) {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        ...userData,
        createdAt: serverTimestamp()
      });
      console.log('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return { 
          id: userDoc.id, 
          ...data,
          createdAt: this.convertTimestamp(data.createdAt),
          subscription: data.subscription ? {
            ...data.subscription,
            startDate: this.convertTimestamp(data.subscription.startDate),
            endDate: this.convertTimestamp(data.subscription.endDate),
          } : undefined,
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  static async updateUser(userId: string, userData: Partial<User>) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: serverTimestamp()
      });
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Events
  static async getEvents(): Promise<Event[]> {
    try {
      const eventsQuery = query(
        collection(db, 'events'),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(eventsQuery);
      const events: Event[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        events.push({ 
          id: doc.id, 
          ...data,
          date: this.convertTimestamp(data.date),
          createdAt: this.convertTimestamp(data.createdAt),
        } as Event);
      });
      
      return events;
    } catch (error) {
      console.error('Error getting events:', error);
      throw error;
    }
  }

  static async getEvent(eventId: string): Promise<Event | null> {
    try {
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) {
        const data = eventDoc.data();
        return { 
          id: eventDoc.id, 
          ...data,
          date: this.convertTimestamp(data.date),
          createdAt: this.convertTimestamp(data.createdAt),
        } as Event;
      }
      return null;
    } catch (error) {
      console.error('Error getting event:', error);
      throw error;
    }
  }

  static async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'registeredCount' | 'waitlistCount'>) {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        date: eventData.date,
        createdAt: serverTimestamp(),
        registeredCount: 0,
        waitlistCount: 0,
        ratingAvg: eventData.ratingAvg || 0,
        ratingCount: eventData.ratingCount || 0
      });
      console.log('Event created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  static async updateEvent(eventId: string, eventData: Partial<Event>) {
    try {
      const updateData: any = { ...eventData };
      delete updateData.id;
      delete updateData.createdAt;
      
      updateData.updatedAt = serverTimestamp();
      
      await updateDoc(doc(db, 'events', eventId), updateData);
      console.log('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  static async deleteEvent(eventId: string) {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Registrations
  static async registerForEvent(eventId: string, userId: string, status: 'confirmed' | 'waitlist' = 'confirmed') {
    try {
      // Add registration
      await addDoc(collection(db, 'events', eventId, 'registrations'), {
        userId,
        status,
        registeredAt: serverTimestamp()
      });

      // Update event counts
      const fieldToIncrement = status === 'confirmed' ? 'registeredCount' : 'waitlistCount';
      await updateDoc(doc(db, 'events', eventId), {
        [fieldToIncrement]: increment(1)
      });

      console.log('Registration successful');
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }

  static async unregisterFromEvent(eventId: string, userId: string) {
    try {
      // Find registration
      const registrationsQuery = query(
        collection(db, 'events', eventId, 'registrations'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(registrationsQuery);
      
      if (!querySnapshot.empty) {
        const registrationDoc = querySnapshot.docs[0];
        const registrationData = registrationDoc.data();
        
        // Delete registration
        await deleteDoc(registrationDoc.ref);
        
        // Update event counts
        const fieldToDecrement = registrationData.status === 'confirmed' ? 'registeredCount' : 'waitlistCount';
        await updateDoc(doc(db, 'events', eventId), {
          [fieldToDecrement]: increment(-1)
        });
        
        console.log('Unregistration successful');
      }
    } catch (error) {
      console.error('Error unregistering from event:', error);
      throw error;
    }
  }

  static async getUserRegistrations(userId: string): Promise<Registration[]> {
    try {
      const events = await this.getEvents();
      const registrations: Registration[] = [];
      
      for (const event of events) {
        const registrationsQuery = query(
          collection(db, 'events', event.id, 'registrations'),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(registrationsQuery);
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          registrations.push({
            id: doc.id,
            eventId: event.id,
            userId: data.userId,
            status: data.status,
            registeredAt: this.convertTimestamp(data.registeredAt),
          });
        });
      }
      
      return registrations;
    } catch (error) {
      console.error('Error getting user registrations:', error);
      throw error;
    }
  }

  static async getEventRegistrations(eventId: string): Promise<Registration[]> {
    try {
      const registrationsQuery = query(
        collection(db, 'events', eventId, 'registrations')
      );
      const querySnapshot = await getDocs(registrationsQuery);
      const registrations: Registration[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        registrations.push({
          id: doc.id,
          eventId,
          userId: data.userId,
          status: data.status,
          registeredAt: this.convertTimestamp(data.registeredAt),
        });
      });
      
      return registrations;
    } catch (error) {
      console.error('Error getting event registrations:', error);
      throw error;
    }
  }

  // Reviews
  static async createReview(eventId: string, reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) {
    try {
      await addDoc(collection(db, 'events', eventId, 'reviews'), {
        userId: reviewData.userId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        userName: reviewData.userName,
        userPhoto: reviewData.userPhoto,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      console.log('Review created successfully');
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  static async getEventReviews(eventId: string): Promise<Review[]> {
    try {
      const reviewsQuery = query(
        collection(db, 'events', eventId, 'reviews'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(reviewsQuery);
      const reviews: Review[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({ 
          id: doc.id, 
          eventId,
          userId: data.userId,
          rating: data.rating,
          comment: data.comment,
          userName: data.userName,
          userPhoto: data.userPhoto,
          status: data.status,
          createdAt: this.convertTimestamp(data.createdAt),
        });
      });
      
      return reviews;
    } catch (error) {
      console.error('Error getting event reviews:', error);
      throw error;
    }
  }

  static async approveReview(eventId: string, reviewId: string) {
    try {
      await updateDoc(doc(db, 'events', eventId, 'reviews', reviewId), {
        status: 'approved',
        approvedAt: serverTimestamp()
      });
      console.log('Review approved successfully');
    } catch (error) {
      console.error('Error approving review:', error);
      throw error;
    }
  }

  static async deleteReview(eventId: string, reviewId: string) {
    try {
      await deleteDoc(doc(db, 'events', eventId, 'reviews', reviewId));
      console.log('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  static async getAllPendingReviews(): Promise<Review[]> {
    try {
      const events = await this.getEvents();
      const pendingReviews: Review[] = [];
      
      for (const event of events) {
        const reviewsQuery = query(
          collection(db, 'events', event.id, 'reviews'),
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(reviewsQuery);
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          pendingReviews.push({
            id: doc.id,
            eventId: event.id,
            userId: data.userId,
            rating: data.rating,
            comment: data.comment,
            userName: data.userName,
            userPhoto: data.userPhoto,
            status: data.status,
            createdAt: this.convertTimestamp(data.createdAt),
          });
        });
      }
      
      return pendingReviews;
    } catch (error) {
      console.error('Error getting pending reviews:', error);
      throw error;
    }
  }
}
