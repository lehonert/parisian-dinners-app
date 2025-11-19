
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import * as ImagePicker from 'expo-image-picker';
import { useResponsive } from '../../hooks/useResponsive';

export default function ProfileSetupScreen() {
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const { user, updateProfile } = useAuth();
  const { isTablet, spacing } = useResponsive();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({ bio, photo });
      router.replace('/(tabs)/events');
    } catch (error) {
      console.log('Profile update error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du profil');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)/events');
  };

  const contentMaxWidth = isTablet ? 600 : undefined;

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingHorizontal: spacing }}>
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <Text style={[styles.title, isTablet && styles.titleTablet]}>Complétez votre profil</Text>
          <Text style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
            Ajoutez une photo et une bio pour vous présenter à la communauté
          </Text>
        </View>

        <View style={[styles.form, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
          <View style={styles.photoSection}>
            <TouchableOpacity style={[styles.photoContainer, isTablet && styles.photoContainerTablet]} onPress={pickImage}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Icon name="camera-outline" size={isTablet ? 48 : 40} color={colors.textLight} />
                  <Text style={[styles.photoText, isTablet && styles.photoTextTablet]}>Ajouter une photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Bio (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.bioInput, isTablet && styles.inputTablet]}
              value={bio}
              onChangeText={setBio}
              placeholder="Parlez-nous de votre passion pour la cuisine..."
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity 
            style={[buttonStyles.primary, styles.saveButton, isTablet && styles.saveButtonTablet]}
            onPress={handleSave}
          >
            <Text style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>Terminer</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={[styles.skipText, isTablet && styles.skipTextTablet]}>Passer cette étape</Text>
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
  header: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  headerTablet: {
    paddingVertical: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  titleTablet: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  subtitleTablet: {
    fontSize: 18,
    lineHeight: 26,
  },
  form: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  photoContainerTablet: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  photoText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
  },
  photoTextTablet: {
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  labelTablet: {
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text,
  },
  inputTablet: {
    fontSize: 18,
    paddingVertical: 14,
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
  },
  saveButton: {
    paddingVertical: 16,
    marginBottom: 16,
  },
  saveButtonTablet: {
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
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    color: colors.textLight,
  },
  skipTextTablet: {
    fontSize: 18,
  },
});
