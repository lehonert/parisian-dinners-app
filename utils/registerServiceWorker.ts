
import { Platform } from 'react-native';

export function registerServiceWorker() {
  // Service worker uniquement disponible sur web
  if (Platform.OS !== 'web') {
    console.log('Service Worker: Not available on this platform');
    return;
  }

  // Vérifier si le navigateur supporte les service workers
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker: Not supported by this browser');
    return;
  }

  // Enregistrer le service worker
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker: Registered successfully', registration);

        // Vérifier les mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('Service Worker: Update found');

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Service Worker: New version available');
                // Vous pouvez afficher un message à l'utilisateur ici
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('Service Worker: Registration failed', error);
      });
  });
}

// Fonction pour désinscrire le service worker (utile pour le développement)
export function unregisterServiceWorker() {
  if (Platform.OS !== 'web' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.unregister();
      console.log('Service Worker: Unregistered');
    })
    .catch((error) => {
      console.error('Service Worker: Unregistration failed', error);
    });
}
