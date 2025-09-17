
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  textColor?: string;
}

export default function Logo({ size = 'medium', textColor = colors.text }: LogoProps) {
  const logoSize = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
  // Made the text smaller and more elegant
  const textSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;

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
    alignItems: 'center',
  },
  logo: {
    marginBottom: 8,
  },
  text: {
    fontWeight: '300', // Changed from '700' to '300' for a more elegant, lighter font
    textAlign: 'center',
    letterSpacing: 0.5, // Added letter spacing for elegance
    fontStyle: 'normal',
  },
});
