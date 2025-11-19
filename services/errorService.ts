
import { Alert, Platform } from 'react-native';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export class ErrorService {
  private static errors: AppError[] = [];

  static logError(error: AppError) {
    console.error('App Error:', error);
    this.errors.push(error);
    
    // Keep only last 50 errors to prevent memory issues
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }
  }

  static showUserError(message: string, title: string = 'Erreur') {
    Alert.alert(title, message, [{ text: 'OK' }]);
  }

  static reportError(error: any, context: string = 'Unknown') {
    console.error(`[${context}]`, error);
    
    const appError: AppError = {
      code: error?.code || 'unknown',
      message: error?.message || String(error),
      details: error,
      timestamp: new Date(),
    };
    
    this.logError(appError);
  }

  static handleAuthError(error: any) {
    console.log('Handling auth error:', error);
    
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'Aucun utilisateur trouvé avec cet email.',
      'auth/wrong-password': 'Mot de passe incorrect.',
      'auth/email-already-in-use': 'Cet email est déjà utilisé.',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
      'auth/invalid-email': 'Format d\'email invalide.',
      'auth/invalid-credential': 'Email ou mot de passe incorrect.',
      'auth/network-request-failed': 'Erreur de connexion. Vérifiez votre connexion internet.',
      'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard.',
      'auth/popup-closed-by-user': 'Connexion annulée.',
      'auth/popup-blocked': 'La fenêtre de connexion a été bloquée. Veuillez autoriser les popups.',
      'auth/cancelled-popup-request': 'Connexion annulée.',
    };

    const message = errorMessages[error.code] || 'Une erreur inattendue s\'est produite.';
    this.showUserError(message);
    
    this.logError({
      code: error.code || 'unknown',
      message: error.message || message,
      details: error,
      timestamp: new Date(),
    });
  }

  static handleEventError(error: any, operation: string) {
    console.log(`Handling event error for ${operation}:`, error);
    
    const errorMessages: { [key: string]: string } = {
      'event/not-found': 'Événement introuvable.',
      'event/full': 'Cet événement est complet.',
      'event/already-registered': 'Vous êtes déjà inscrit à cet événement.',
      'event/registration-closed': 'Les inscriptions sont fermées.',
      'event/permission-denied': 'Vous n\'avez pas les permissions nécessaires.',
    };

    const message = errorMessages[error.code] || `Erreur lors de ${operation}.`;
    this.showUserError(message);
    
    this.logError({
      code: error.code || 'event-error',
      message: error.message || message,
      details: { operation, error },
      timestamp: new Date(),
    });
  }

  static getRecentErrors(): AppError[] {
    return this.errors.slice(-10);
  }

  static clearErrors() {
    this.errors = [];
  }
}
