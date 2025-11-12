
import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

interface ResponsiveConfig {
  isTablet: boolean;
  isPhone: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  columns: number;
  spacing: number;
  fontSize: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
}

export const useResponsive = (): ResponsiveConfig => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  const isTablet = width >= 768;
  const isPhone = width < 768;
  const orientation = width > height ? 'landscape' : 'portrait';

  // Determine number of columns based on screen size
  let columns = 1;
  if (width >= 1024) {
    columns = 3;
  } else if (width >= 768) {
    columns = 2;
  }

  // Responsive spacing
  const spacing = isTablet ? 24 : 20;

  // Responsive font sizes
  const fontSize = {
    small: isTablet ? 14 : 12,
    medium: isTablet ? 18 : 16,
    large: isTablet ? 24 : 20,
    xlarge: isTablet ? 32 : 28,
  };

  return {
    isTablet,
    isPhone,
    screenWidth: width,
    screenHeight: height,
    orientation,
    columns,
    spacing,
    fontSize,
  };
};

// Helper function to get responsive value
export const getResponsiveValue = (phoneValue: number, tabletValue: number): number => {
  const { width } = Dimensions.get('window');
  return width >= 768 ? tabletValue : phoneValue;
};

// Helper function to get column width
export const getColumnWidth = (columns: number, spacing: number, screenWidth: number): number => {
  const totalSpacing = spacing * (columns + 1);
  return (screenWidth - totalSpacing) / columns;
};
