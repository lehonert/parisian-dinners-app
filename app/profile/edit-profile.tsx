
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import * as ImagePicker from 'expo-image-picker';
import { useResponsive } from '../../hooks/useResponsive';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const { isTablet, spacing } = useResponsive();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [photo, setPhoto] = useState(user?.photo || '');
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission requise',
          'Vous devez autoriser l\'accès à vos photos pour changer votre photo de profil.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner une image.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission requise',
          'Vous devez autoriser l\'accès à la caméra pour prendre une photo.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre une photo.');
    }
  };

  const handlePhotoOptions = () => {
    Alert.alert(
      'Photo de profil',
      'Choisissez une option',
      [
        {
          text: 'Prendre une photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choisir depuis la galerie',
          onPress: handlePickImage,
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        Alert.alert('Erreur', 'Le nom est requis.');
        return;
      }

      setIsLoading(true);

      await updateProfile({
        name: name.trim(),
        bio: bio.trim() || undefined,
        photo: photo || undefined,
      });

      Alert.alert(
        'Succès',
        'Votre profil a été mis à jour avec succès.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Erreur', error.message || 'Impossible de mettre à jour le profil.');
    } finally {
      setIsLoading(false);
    }
  };

  const contentMaxWidth = isTablet ? 800 : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Modifier le profil
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingHorizontal: spacing, maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={handlePhotoOptions} style={styles.photoContainer}>
            <Image
              source={{
                uri: photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              }}
              style={[styles.photo, isTablet && styles.photoTablet]}
            />
            <View style={[styles.photoOverlay, isTablet && styles.photoOverlayTablet]}>
              <Icon name="camera" size={isTablet ? 32 : 24} color={colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.photoHint, isTablet && styles.photoHintTablet]}>
            Appuyez pour changer la photo
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Nom *</Text>
            <TextInput
              style={[styles.input, isTablet && styles.inputTablet]}
              value={name}
              onChangeText={setName}
              placeholder="Votre nom"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled, isTablet && styles.inputTablet]}
              value={user?.email}
              editable={false}
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={[styles.hint, isTablet && styles.hintTablet]}>
              L&apos;email ne peut pas être modifié
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea, isTablet && styles.inputTablet, isTablet && styles.textAreaTablet]}
              value={bio}
              onChangeText={setBio}
              placeholder="Parlez-nous de vous..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={[styles.hint, isTablet && styles.hintTablet]}>
              {bio.length} / 200 caractères
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[buttonStyles.primary, styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={buttonStyles.primaryText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerTitleTablet: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 24,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
  },
  photoTablet: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  photoOverlayTablet: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  photoHint: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  photoHintTablet: {
    fontSize: 16,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  labelTablet: {
    fontSize: 18,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputTablet: {
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
  },
  inputDisabled: {
    backgroundColor: colors.border,
    color: colors.textSecondary,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  textAreaTablet: {
    height: 120,
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  hintTablet: {
    fontSize: 14,
  },
  saveButton: {
    marginBottom: 40,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
});
