
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
        <Image 
          source={require('../assets/images/92510293-455a-4eb0-b08e-b4694dac60f6.png')}
          style={[styles.logo, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
        />
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
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginRight: 16,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 8,
  },
});
