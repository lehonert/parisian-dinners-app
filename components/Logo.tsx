
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  textColor?: string;
}

export default function Logo({ size = 'medium', showText = true, textColor = colors.text }: LogoProps) {
  const logoSize = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
  const textSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/cafbfb80-1bd8-4ff8-9042-d8018ae531d9.png')}
        style={[styles.logo, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
      />
      {showText && (
        <Text style={[styles.text, { fontSize: textSize, color: textColor }]}>
          Les Dîners Parisiens
        </Text>
      )}
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
    fontWeight: '700',
    textAlign: 'center',
  },
});
