
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  textColor?: string;
}

export default function Logo({ size = 'medium', showText = true, textColor = colors.text }: LogoProps) {
  const logoSize = size === 'small' ? 56 : size === 'medium' ? 78 : 96;
  const textSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image 
          source={require('../assets/images/f7e470d9-77bb-4dba-8675-5f1879e22ded.png')}
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
    marginRight: 12,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
