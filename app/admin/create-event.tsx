
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';
import { useResponsive } from '../../hooks/useResponsive';

const DEFAULT_EVENT_PRICE = 150;

export default function CreateEventScreen() {
  const { user } = useAuth();
  const { isTablet, spacing } = useResponsive();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    chef: '',
    image: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    price: DEFAULT_EVENT_PRICE.toString(),
  });

  // Redirect if not admin
  if (!user?.isAdmin) {
    return <Redirect href="/(tabs)/events" />;
  }

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field}:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    console.log('Picking image');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleInputChange('image', result.assets[0].uri);
    }
  };

  const handleCreate = () => {
    console.log('Creating event with data:', formData);
    
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Erreur', 'Le titre est requis');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Erreur', 'La description est requise');
      return;
    }
    if (!formData.chef.trim()) {
      Alert.alert('Erreur', 'Le nom du chef est requis');
      return;
    }
    if (!formData.date.trim()) {
      Alert.alert('Erreur', 'La date est requise');
      return;
    }
    if (!formData.time.trim()) {
      Alert.alert('Erreur', 'L\'heure est requise');
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert('Erreur', 'Le lieu est requis');
      return;
    }
    if (!formData.capacity.trim() || isNaN(Number(formData.capacity))) {
      Alert.alert('Erreur', 'La capacité doit être un nombre valide');
      return;
    }
    if (!formData.price.trim() || isNaN(Number(formData.price))) {
      Alert.alert('Erreur', 'Le prix doit être un nombre valide');
      return;
    }

    // Simulate API call
    Alert.alert(
      'Succès',
      'Événement créé avec succès !',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const contentMaxWidth = isTablet ? 800 : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingHorizontal: spacing }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={isTablet ? 28 : 24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>Créer un événement</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.form, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%', paddingHorizontal: spacing }]}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Titre *</Text>
            <TextInput
              style={[styles.input, isTablet && styles.inputTablet]}
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholder="Nom de l'événement"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea, isTablet && styles.inputTablet]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Description détaillée de l'événement"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Chef *</Text>
            <TextInput
              style={[styles.input, isTablet && styles.inputTablet]}
              value={formData.chef}
              onChangeText={(value) => handleInputChange('chef', value)}
              placeholder="Nom du chef"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.imageSection}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Image de l'événement</Text>
            {formData.image ? (
              <Image source={{ uri: formData.image }} style={[styles.imagePreview, isTablet && styles.imagePreviewTablet]} />
            ) : (
              <View style={[styles.imagePlaceholder, isTablet && styles.imagePlaceholderTablet]}>
                <Icon name="image-outline" size={isTablet ? 56 : 48} color={colors.textLight} />
                <Text style={[styles.imagePlaceholderText, isTablet && styles.imagePlaceholderTextTablet]}>Aucune image sélectionnée</Text>
              </View>
            )}
            <TouchableOpacity style={[styles.imageButton, isTablet && styles.imageButtonTablet]} onPress={pickImage}>
              <Icon name="camera-outline" size={isTablet ? 22 : 20} color={colors.white} />
              <Text style={[styles.imageButtonText, isTablet && styles.imageButtonTextTablet]}>
                {formData.image ? 'Changer l\'image' : 'Ajouter une image'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.row, isTablet && styles.rowTablet]}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={[styles.label, isTablet && styles.labelTablet]}>Date *</Text>
              <TextInput
                style={[styles.input, isTablet && styles.inputTablet]}
                value={formData.date}
                onChangeText={(value) => handleInputChange('date', value)}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor={colors.textLight}
              />
            </View>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={[styles.label, isTablet && styles.labelTablet]}>Heure *</Text>
              <TextInput
                style={[styles.input, isTablet && styles.inputTablet]}
                value={formData.time}
                onChangeText={(value) => handleInputChange('time', value)}
                placeholder="HH:MM"
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>Lieu *</Text>
            <TextInput
              style={[styles.input, isTablet && styles.inputTablet]}
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="Adresse complète"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={[styles.row, isTablet && styles.rowTablet]}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={[styles.label, isTablet && styles.labelTablet]}>Capacité *</Text>
              <TextInput
                style={[styles.input, isTablet && styles.inputTablet]}
                value={formData.capacity}
                onChangeText={(value) => handleInputChange('capacity', value)}
                placeholder="Nombre de places"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={[styles.label, isTablet && styles.labelTablet]}>Prix (€) *</Text>
              <TextInput
                style={[styles.input, isTablet && styles.inputTablet]}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="Prix par personne"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.priceInfoBox}>
            <Icon name="info" size={isTablet ? 22 : 20} color={colors.primary} style={styles.infoIcon} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.priceInfoTitle, isTablet && styles.priceInfoTitleTablet]}>
                Tarification
              </Text>
              <Text style={[styles.priceInfoText, isTablet && styles.priceInfoTextTablet]}>
                Prix standard : {formData.price}€ (non-abonnés)
              </Text>
              <Text style={[styles.priceInfoText, isTablet && styles.priceInfoTextTablet]}>
                Prix abonnés : {Math.max(0, Number(formData.price) - 30)}€ (réduction de 30€)
              </Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.createButton, isTablet && styles.createButtonTablet]} onPress={handleCreate}>
            <Text style={[styles.createButtonText, isTablet && styles.createButtonTextTablet]}>Créer l'événement</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  headerTitleTablet: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  form: {
    backgroundColor: colors.white,
    marginVertical: 16,
    borderRadius: 12,
    padding: 20,
  },
  formGroup: {
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
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputTablet: {
    fontSize: 18,
    paddingVertical: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  imagePreviewTablet: {
    height: 300,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginBottom: 12,
  },
  imagePlaceholderTablet: {
    height: 300,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 8,
  },
  imagePlaceholderTextTablet: {
    fontSize: 18,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  imageButtonTablet: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  imageButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  imageButtonTextTablet: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowTablet: {
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  priceInfoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  priceInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  priceInfoTitleTablet: {
    fontSize: 16,
  },
  priceInfoText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  priceInfoTextTablet: {
    fontSize: 15,
    lineHeight: 20,
  },
  createButton: {
    ...buttonStyles.primary,
    marginTop: 20,
  },
  createButtonTablet: {
    marginTop: 30,
    paddingVertical: 18,
  },
  createButtonText: {
    ...buttonStyles.primaryText,
  },
  createButtonTextTablet: {
    fontSize: 18,
  },
});
