
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  textColor?: string;
}

export default function Logo({ size = 'medium', textColor = colors.text }: LogoProps) {
  const logoSize = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
  // Made the text larger as requested
  const textSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/cafbfb80-1bd8-4ff8-9042-d8018ae531d9.png')}
        style={[styles.logo, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
      />
      <Text style={[styles.text, { fontSize: textSize, color: textColor }]}>
        Les Dîners Parisiens
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Changed from column to row to position text next to logo
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginRight: 12, // Changed from marginBottom to marginRight for horizontal spacing
  },
  text: {
    fontWeight: '400', // Slightly increased weight for better readability
    textAlign: 'center',
    letterSpacing: 0.5,
    fontStyle: 'normal',
  },
});
