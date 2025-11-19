
import { ErrorService } from '../services/errorService';

export function setupErrorLogging() {
  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Prevent the default error handling
      event.preventDefault();
      
      // Log the error
      ErrorService.reportError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        'Unhandled Promise Rejection'
      );
    });
  }

  // Handle global errors
  const originalErrorHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('Global error:', error, 'isFatal:', isFatal);
    
    // Log the error
    ErrorService.reportError(error, isFatal ? 'Fatal Error' : 'Non-Fatal Error');
    
    // Call the original handler
    if (originalErrorHandler) {
      originalErrorHandler(error, isFatal);
    }
  });

  console.log('Error logging setup complete');
}
