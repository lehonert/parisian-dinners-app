
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Sur mobile, on suppose toujours en ligne
      // Vous pouvez utiliser @react-native-community/netinfo pour une détection précise
      return;
    }

    // Sur web, utiliser l'API Navigator
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Vérifier l'état initial
    updateOnlineStatus();

    // Écouter les changements
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;
}
