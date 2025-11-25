
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  textColor?: string;
}

export default function Logo({ size = 'medium', showText = true, textColor = colors.text }: LogoProps) {
  const logoSize = size === 'small' ? 56 : size === 'medium' ? 72 : 88;
  const textSize = size === 'small' ? 14 : size === 'medium' ? 18 : 22;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={[styles.logoCircle, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}>
          <Image 
            source={require('../assets/images/c733bcf2-a7f0-4419-9839-7727c8c74b52.png')}
            style={{ width: logoSize, height: logoSize }}
            resizeMode="cover"
          />
        </View>
        {showText && (
          <Text style={[styles.text, { fontSize: textSize, color: textColor }]}>
            Les Dîners Parisiens
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoCircle: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
