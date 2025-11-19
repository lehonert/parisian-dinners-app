
import { ErrorService } from '../services/errorService';
import { Platform } from 'react-native';

export function setupErrorLogging() {
  console.log('Setting up error logging...');
  
  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Prevent the default error handling
      event.preventDefault();
      
      // Log the error but don't crash the app
      try {
        ErrorService.reportError(
          event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
          'Unhandled Promise Rejection'
        );
      } catch (logError) {
        console.error('Error while logging unhandled rejection:', logError);
      }
    });
    
    console.log('Web error handlers registered');
  }

  // Handle global errors for React Native
  if (Platform.OS !== 'web' && typeof ErrorUtils !== 'undefined') {
    const originalErrorHandler = ErrorUtils.getGlobalHandler();
    
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.error('Global error:', error, 'isFatal:', isFatal);
      
      // Log the error
      try {
        ErrorService.reportError(error, isFatal ? 'Fatal Error' : 'Non-Fatal Error');
      } catch (logError) {
        console.error('Error while logging global error:', logError);
      }
      
      // Call the original handler
      if (originalErrorHandler) {
        originalErrorHandler(error, isFatal);
      }
    });
    
    console.log('Native error handlers registered');
  }

  console.log('Error logging setup complete');
}
