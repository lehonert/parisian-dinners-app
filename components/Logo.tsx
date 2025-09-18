
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  textColor?: string;
}

export default function Logo({ size = 'medium', showText = true, textColor = colors.text }: LogoProps) {
  const logoSize = size === 'small' ? 40 : size === 'medium' ? 50 : 60;
  const textSize = size === 'small' ? 14 : size === 'medium' ? 16 : 18;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {showText && (
          <Text style={[styles.text, { fontSize: textSize, color: textColor }]}>
            Les Dîners Parisiens
          </Text>
        )}
        <Image 
          source={require('../assets/images/f35ea56a-3345-48e6-80e2-d5bf5cf93081.png')}
          style={[styles.logo, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginLeft: 12,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
