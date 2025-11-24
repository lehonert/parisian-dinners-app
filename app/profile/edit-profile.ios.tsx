
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
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const theme = useTheme();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [photo, setPhoto] = useState(user?.photo || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profession, setProfession] = useState(user?.profession || '');
  const [howDidYouFindUs, setHowDidYouFindUs] = useState(user?.howDidYouFindUs || '');
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

      if (bio.length > 200) {
        Alert.alert('Erreur', 'La bio ne peut pas dépasser 200 caractères.');
        return;
      }

      if (phone && !/^[\d\s+\-()]+$/.test(phone)) {
        Alert.alert('Erreur', 'Le numéro de téléphone n\'est pas valide.');
        return;
      }

      setIsLoading(true);

      await updateProfile({
        name: name.trim(),
        bio: bio.trim() || undefined,
        photo: photo || undefined,
        phone: phone.trim() || undefined,
        profession: profession.trim() || undefined,
        howDidYouFindUs: howDidYouFindUs.trim() || undefined,
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Modifier le profil
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <GlassView style={styles.photoSection} glassEffectStyle="regular">
          <TouchableOpacity onPress={handlePhotoOptions} style={styles.photoContainer}>
            <Image
              source={{
                uri: photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              }}
              style={styles.photo}
            />
            <View style={[styles.photoOverlay, { backgroundColor: theme.colors.primary }]}>
              <IconSymbol ios_icon_name="camera.fill" android_material_icon_name="camera" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.photoHint, { color: theme.dark ? '#98989D' : '#666' }]}>
            Appuyez pour changer la photo
          </Text>
        </GlassView>

        <GlassView style={styles.form} glassEffectStyle="regular">
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Nom / Prénom *</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text, backgroundColor: theme.dark ? '#1C1C1E' : '#F2F2F7' }]}
              value={name}
              onChangeText={setName}
              placeholder="Votre nom complet"
              placeholderTextColor={theme.dark ? '#98989D' : '#666'}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled, { color: theme.dark ? '#98989D' : '#666', backgroundColor: theme.dark ? '#1C1C1E' : '#F2F2F7' }]}
              value={user?.email}
              editable={false}
              placeholderTextColor={theme.dark ? '#98989D' : '#666'}
            />
            <Text style={[styles.hint, { color: theme.dark ? '#98989D' : '#666' }]}>
              L&apos;email ne peut pas être modifié
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Téléphone</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text, backgroundColor: theme.dark ? '#1C1C1E' : '#F2F2F7' }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="+33 6 12 34 56 78"
              placeholderTextColor={theme.dark ? '#98989D' : '#666'}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Profession</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text, backgroundColor: theme.dark ? '#1C1C1E' : '#F2F2F7' }]}
              value={profession}
              onChangeText={setProfession}
              placeholder="Votre profession"
              placeholderTextColor={theme.dark ? '#98989D' : '#666'}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Comment nous avez-vous connus ?</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text, backgroundColor: theme.dark ? '#1C1C1E' : '#F2F2F7' }]}
              value={howDidYouFindUs}
              onChangeText={setHowDidYouFindUs}
              placeholder="Réseaux sociaux, bouche à oreille, etc."
              placeholderTextColor={theme.dark ? '#98989D' : '#666'}
              autoCapitalize="sentences"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea, { color: theme.colors.text, backgroundColor: theme.dark ? '#1C1C1E' : '#F2F2F7' }]}
              value={bio}
              onChangeText={(text) => {
                if (text.length <= 200) {
                  setBio(text);
                }
              }}
              placeholder="Parlez-nous de vous..."
              placeholderTextColor={theme.dark ? '#98989D' : '#666'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={200}
            />
            <Text style={[styles.hint, { color: theme.dark ? '#98989D' : '#666' }]}>
              {bio.length} / 200 caractères
            </Text>
          </View>
        </GlassView>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 20,
  },
  photoSection: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  photoHint: {
    fontSize: 14,
  },
  form: {
    borderRadius: 12,
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  hint: {
    fontSize: 12,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
