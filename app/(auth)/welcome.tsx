
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useResponsive } from '../../hooks/useResponsive';

export default function WelcomeScreen() {
  const { isTablet, spacing } = useResponsive();
  const contentMaxWidth = isTablet ? 700 : undefined;

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingHorizontal: spacing }}>
        <View style={[styles.content, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
          <View style={[styles.logoContainer, isTablet && styles.logoContainerTablet]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop' }}
              style={[styles.logo, isTablet && styles.logoTablet]}
            />
            <Text style={[styles.title, isTablet && styles.titleTablet]}>Les Dîners Parisiens</Text>
            <Text style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
              Il n&apos;y a rien de plus puissant qu&apos;une rencontre. <Text style={styles.italicText}>Victor Hugo</Text>
            </Text>
          </View>
          
          <View style={[styles.description, isTablet && styles.descriptionTablet]}>
            <Text style={[styles.descriptionText, isTablet && styles.descriptionTextTablet]}>
              Afterwork + Networking + Dîner{'\n'}Un seul mot d&apos;ordre : la rencontre
            </Text>
          </View>
        </View>
        
        <View style={[styles.buttonContainer, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
          <TouchableOpacity 
            style={[buttonStyles.primary, styles.button, isTablet && styles.buttonTablet]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>Se connecter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[buttonStyles.secondary, styles.button, isTablet && styles.buttonTablet]}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={[styles.buttonTextSecondary, isTablet && styles.buttonTextSecondaryTablet]}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainerTablet: {
    marginBottom: 80,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  logoTablet: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  titleTablet: {
    fontSize: 40,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.textLight,
    textAlign: 'center',
  },
  subtitleTablet: {
    fontSize: 20,
  },
  italicText: {
    fontStyle: 'italic',
  },
  description: {
    paddingHorizontal: 20,
  },
  descriptionTablet: {
    paddingHorizontal: 40,
  },
  descriptionText: {
    fontSize: 19,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  descriptionTextTablet: {
    fontSize: 21,
    lineHeight: 32,
  },
  buttonContainer: {
    gap: 16,
    paddingVertical: 40,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
  },
  buttonTablet: {
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  buttonTextTablet: {
    fontSize: 18,
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  buttonTextSecondaryTablet: {
    fontSize: 18,
  },
});
