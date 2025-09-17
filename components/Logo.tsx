
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  textColor?: string;
}

export default function Logo({ size = 'medium', textColor = colors.text }: LogoProps) {
  const logoSize = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
  // Text size similar to tab bar labels (12px)
  const textSize = 12;

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
    flexDirection: 'column', // Text positioned below the logo
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 8, // Spacing between logo and text
  },
  text: {
    fontWeight: '500', // Similar weight to tab bar labels
    textAlign: 'center',
    letterSpacing: 0.5,
    fontStyle: 'normal',
  },
});
