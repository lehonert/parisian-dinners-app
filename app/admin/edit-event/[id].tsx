
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../../styles/commonStyles';
import Icon from '../../../components/Icon';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../contexts/AuthContext';
import { mockEvents } from '../../../data/mockData';
import { Redirect } from 'expo-router';
import { useResponsive } from '../../../hooks/useResponsive';

export default function EditEventScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
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
    price: '',
  });

  // Fix: Always call useEffect at the top level
  useEffect(() => {
    if (id) {
      // Load event data
      const event = mockEvents.find(e => e.id === id);
      if (event) {
        console.log('Loading event data:', event);
        const eventDate = new Date(event.date);
        setFormData({
          title: event.title,
          description: event.description,
          chef: event.chef,
          image: event.image,
          date: eventDate.toLocaleDateString('fr-FR'),
          time: eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          location: event.location,
          capacity: event.capacity.toString(),
          price: event.price.toString(),
        });
      }
    }
  }, [id]);

  // Redirect if not admin - moved after hooks
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

  const handleSave = () => {
    console.log('Saving event with data:', formData);
    
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
      'Événement modifié avec succès !',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleDelete = () => {
    console.log('Deleting event:', id);
    Alert.alert(
      'Supprimer l\'événement',
      'Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Événement supprimé',
              'L\'événement a été supprimé avec succès.',
              [
                {
                  text: 'OK',
                  onPress: () => router.push('/(tabs)/admin'),
                },
              ]
            );
          },
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
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>Modifier l'événement</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Icon name="trash-outline" size={isTablet ? 28 : 24} color={colors.error} />
        </TouchableOpacity>
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
        </View>

        <View style={[styles.buttonRow, { paddingHorizontal: spacing }]}>
          <TouchableOpacity style={[styles.saveButton, isTablet && styles.saveButtonTablet]} onPress={handleSave}>
            <Text style={[styles.saveButtonText, isTablet && styles.saveButtonTextTablet]}>Sauvegarder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.deleteEventButton, isTablet && styles.deleteEventButtonTablet]} onPress={handleDelete}>
            <Text style={[styles.deleteEventButtonText, isTablet && styles.deleteEventButtonTextTablet]}>Supprimer</Text>
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
    flex: 1,
  },
  headerTitleTablet: {
    fontSize: 24,
  },
  deleteButton: {
    padding: 8,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  saveButton: {
    ...buttonStyles.primary,
    flex: 1,
  },
  saveButtonTablet: {
    paddingVertical: 18,
  },
  saveButtonText: {
    ...buttonStyles.primaryText,
  },
  saveButtonTextTablet: {
    fontSize: 18,
  },
  deleteEventButton: {
    backgroundColor: colors.error,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  deleteEventButtonTablet: {
    paddingVertical: 18,
  },
  deleteEventButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteEventButtonTextTablet: {
    fontSize: 18,
  },
});
