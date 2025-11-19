
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, buttonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { useResponsive } from '../../hooks/useResponsive';

interface FAQItem {
  question: string;
  answer: string;
  expanded: boolean;
}

export default function HelpSupportScreen() {
  const { isTablet, spacing } = useResponsive();
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: 'Comment puis-je m\'inscrire à un événement ?',
      answer: 'Pour vous inscrire à un événement, rendez-vous sur la page de l\'événement et cliquez sur le bouton "S\'inscrire". Si l\'événement est complet, vous serez ajouté à la liste d\'attente.',
      expanded: false,
    },
    {
      question: 'Comment annuler mon inscription ?',
      answer: 'Vous pouvez annuler votre inscription depuis la page de l\'événement ou depuis l\'onglet "Mes inscriptions". Cliquez sur "Se désinscrire" pour annuler.',
      expanded: false,
    },
    {
      question: 'Que se passe-t-il si je suis sur liste d\'attente ?',
      answer: 'Si une place se libère, vous recevrez une notification et votre statut passera automatiquement de "liste d\'attente" à "confirmé".',
      expanded: false,
    },
    {
      question: 'Comment laisser un avis ?',
      answer: 'Après avoir participé à un événement, vous pouvez laisser un avis depuis la page de l\'événement. Votre avis sera visible après validation par un administrateur.',
      expanded: false,
    },
    {
      question: 'Comment fonctionne l\'abonnement ?',
      answer: 'L\'abonnement vous donne accès à tous les événements. Vous pouvez choisir entre un abonnement mensuel ou annuel. L\'abonnement se renouvelle automatiquement.',
      expanded: false,
    },
    {
      question: 'Comment modifier mon profil ?',
      answer: 'Rendez-vous dans l\'onglet "Profil" et cliquez sur "Modifier le profil". Vous pouvez changer votre photo, nom et bio.',
      expanded: false,
    },
    {
      question: 'Comment contacter le support ?',
      answer: 'Vous pouvez nous contacter via le formulaire ci-dessous ou par email à support@diners-parisiens.fr. Nous répondons généralement sous 24h.',
      expanded: false,
    },
  ]);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const toggleFAQ = (index: number) => {
    setFaqs(prev =>
      prev.map((faq, i) =>
        i === index ? { ...faq, expanded: !faq.expanded } : faq
      )
    );
  };

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    Alert.alert(
      'Message envoyé',
      'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
      [
        {
          text: 'OK',
          onPress: () => {
            setSubject('');
            setMessage('');
          },
        },
      ]
    );
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@diners-parisiens.fr');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+33123456789');
  };

  const contentMaxWidth = isTablet ? 800 : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Aide et support
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
        {/* Quick Contact */}
        <View style={styles.quickContactSection}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            Contact rapide
          </Text>
          <View style={styles.quickContactButtons}>
            <TouchableOpacity
              style={[styles.quickContactButton, isTablet && styles.quickContactButtonTablet]}
              onPress={handleEmail}
            >
              <Icon name="mail" size={isTablet ? 28 : 24} color={colors.primary} />
              <Text style={[styles.quickContactText, isTablet && styles.quickContactTextTablet]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickContactButton, isTablet && styles.quickContactButtonTablet]}
              onPress={handlePhone}
            >
              <Icon name="call" size={isTablet ? 28 : 24} color={colors.primary} />
              <Text style={[styles.quickContactText, isTablet && styles.quickContactTextTablet]}>
                Téléphone
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            Questions fréquentes
          </Text>
          <View style={styles.faqList}>
            {faqs.map((faq, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[styles.faqItem, isTablet && styles.faqItemTablet]}
                  onPress={() => toggleFAQ(index)}
                  activeOpacity={0.7}
                >
                  <View style={styles.faqHeader}>
                    <Text style={[styles.faqQuestion, isTablet && styles.faqQuestionTablet]}>
                      {faq.question}
                    </Text>
                    <Icon
                      name={faq.expanded ? 'chevron-up' : 'chevron-down'}
                      size={isTablet ? 24 : 20}
                      color={colors.textSecondary}
                    />
                  </View>
                  {faq.expanded && (
                    <Text style={[styles.faqAnswer, isTablet && styles.faqAnswerTablet]}>
                      {faq.answer}
                    </Text>
                  )}
                </TouchableOpacity>
                {index < faqs.length - 1 && <View style={styles.separator} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.contactSection}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            Nous contacter
          </Text>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isTablet && styles.labelTablet]}>Sujet</Text>
              <TextInput
                style={[styles.input, isTablet && styles.inputTablet]}
                value={subject}
                onChangeText={setSubject}
                placeholder="Objet de votre message"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isTablet && styles.labelTablet]}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea, isTablet && styles.inputTablet, isTablet && styles.textAreaTablet]}
                value={message}
                onChangeText={setMessage}
                placeholder="Décrivez votre problème ou votre question..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={buttonStyles.primary} onPress={handleSubmit}>
              <Text style={buttonStyles.primaryText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactInfoSection}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            Informations de contact
          </Text>
          <View style={styles.contactInfoCard}>
            <View style={styles.contactInfoItem}>
              <Icon name="mail" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.contactInfoIcon} />
              <Text style={[styles.contactInfoText, isTablet && styles.contactInfoTextTablet]}>
                support@diners-parisiens.fr
              </Text>
            </View>
            <View style={styles.contactInfoItem}>
              <Icon name="call" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.contactInfoIcon} />
              <Text style={[styles.contactInfoText, isTablet && styles.contactInfoTextTablet]}>
                +33 1 23 45 67 89
              </Text>
            </View>
            <View style={styles.contactInfoItem}>
              <Icon name="time" size={isTablet ? 24 : 20} color={colors.textSecondary} style={styles.contactInfoIcon} />
              <Text style={[styles.contactInfoText, isTablet && styles.contactInfoTextTablet]}>
                Lun - Ven : 9h - 18h
              </Text>
            </View>
          </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  sectionTitleTablet: {
    fontSize: 22,
  },
  quickContactSection: {
    marginBottom: 32,
  },
  quickContactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickContactButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickContactButtonTablet: {
    padding: 24,
    borderRadius: 16,
  },
  quickContactText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  quickContactTextTablet: {
    fontSize: 16,
  },
  faqSection: {
    marginBottom: 32,
  },
  faqList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqItem: {
    padding: 16,
  },
  faqItemTablet: {
    padding: 20,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 12,
  },
  faqQuestionTablet: {
    fontSize: 18,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 12,
  },
  faqAnswerTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  contactSection: {
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  textAreaTablet: {
    height: 150,
  },
  contactInfoSection: {
    marginBottom: 40,
  },
  contactInfoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactInfoIcon: {
    marginRight: 12,
  },
  contactInfoText: {
    fontSize: 14,
    color: colors.text,
  },
  contactInfoTextTablet: {
    fontSize: 16,
  },
});
