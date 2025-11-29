
import { useState, useEffect } from 'react';
import { Platform, Dimensions } from 'react-native';

interface WebOptimization {
  isWeb: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  maxContentWidth: number;
}

export function useWebOptimization(): WebOptimization {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  const isWeb = Platform.OS === 'web';
  const screenWidth = dimensions.width;
  const screenHeight = dimensions.height;

  // Breakpoints
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  // Max content width for desktop (centered layout)
  const maxContentWidth = isDesktop ? 1200 : screenWidth;

  return {
    isWeb,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
    maxContentWidth,
  };
}
