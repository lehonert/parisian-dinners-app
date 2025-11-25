
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  textColor?: string;
}

export default function Logo({ size = 'medium', showText = true, textColor = colors.text }: LogoProps) {
  const logoSize = size === 'small' ? 80 : size === 'medium' ? 120 : 160;
  const textSize = size === 'small' ? 14 : size === 'medium' ? 18 : 22;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image 
          source={require('../assets/images/a11fa704-6e5d-40f6-b86a-8f03f61c0807.png')}
          style={{ 
            width: logoSize, 
            height: logoSize,
          }}
          resizeMode="contain"
        />
        {showText && (
          <Text style={[styles.text, { fontSize: textSize, color: textColor, marginTop: 16 }]}>
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
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
