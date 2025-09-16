
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  deleteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  form: {
    backgroundColor: colors.white,
    margin: 16,
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
  imagePlaceholderText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 8,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  imageButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    margin: 16,
    marginTop: 0,
  },
  saveButton: {
    ...buttonStyles.primary,
    flex: 1,
  },
  saveButtonText: {
    ...buttonStyles.primaryText,
  },
  deleteEventButton: {
    backgroundColor: colors.error,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  deleteEventButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function EditEventScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
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

  // Fix: Move useEffect before the conditional return
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier l'événement</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Icon name="trash-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Titre *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholder="Nom de l'événement"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Description détaillée de l'événement"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Chef *</Text>
            <TextInput
              style={styles.input}
              value={formData.chef}
              onChangeText={(value) => handleInputChange('chef', value)}
              placeholder="Nom du chef"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.imageSection}>
            <Text style={styles.label}>Image de l'événement</Text>
            {formData.image ? (
              <Image source={{ uri: formData.image }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="image-outline" size={48} color={colors.textLight} />
                <Text style={styles.imagePlaceholderText}>Aucune image sélectionnée</Text>
              </View>
            )}
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Icon name="camera-outline" size={20} color={colors.white} />
              <Text style={styles.imageButtonText}>
                {formData.image ? 'Changer l\'image' : 'Ajouter une image'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(value) => handleInputChange('date', value)}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor={colors.textLight}
              />
            </View>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Heure *</Text>
              <TextInput
                style={styles.input}
                value={formData.time}
                onChangeText={(value) => handleInputChange('time', value)}
                placeholder="HH:MM"
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Lieu *</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="Adresse complète"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Capacité *</Text>
              <TextInput
                style={styles.input}
                value={formData.capacity}
                onChangeText={(value) => handleInputChange('capacity', value)}
                placeholder="Nombre de places"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Prix (€) *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="Prix par personne"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Sauvegarder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteEventButton} onPress={handleDelete}>
            <Text style={styles.deleteEventButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
