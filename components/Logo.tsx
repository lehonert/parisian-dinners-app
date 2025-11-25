
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
          source={require('../assets/images/8a1bc83c-cbbc-4d4c-9c70-01cd7f76a731.jpeg')}
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
    justifyContent: 'center',
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    marginBottom: 16,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
