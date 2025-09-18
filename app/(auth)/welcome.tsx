
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.titleWithLogo}>
              <Image 
                source={require('../../assets/images/1211d479-298d-41f7-ac4d-cfe044c255c3.png')}
                style={styles.logoImage}
              />
              <Text style={styles.title}>Les Dîners Parisiens</Text>
            </View>
            <Text style={styles.subtitle}>Découvrez l'art culinaire parisien</Text>
          </View>
          
          <View style={styles.description}>
            <Text style={styles.descriptionText}>
              Rejoignez notre communauté de passionnés de gastronomie et participez à des expériences culinaires uniques dans la capitale.
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[buttonStyles.primary, styles.button]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[buttonStyles.secondary, styles.button]}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.buttonTextSecondary}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  titleWithLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.textLight,
    textAlign: 'center',
  },
  description: {
    paddingHorizontal: 20,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
