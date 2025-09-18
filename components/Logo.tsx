
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  textColor?: string;
}

export default function Logo({ size = 'medium', showText = true, textColor = colors.text }: LogoProps) {
  console.log('Logo component rendered with size:', size, 'showText:', showText);
  
  // Tailles ajustées pour un meilleur affichage
  const logoSize = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
  const textSize = size === 'small' ? 14 : size === 'medium' ? 18 : 22;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image 
          source={require('../assets/images/fb9eedbc-d9ea-4eba-9b37-6a1fff129442.png')}
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
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  logo: {
    marginRight: 12,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
    flexShrink: 1,
  },
});
