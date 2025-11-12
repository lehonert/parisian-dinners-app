
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import { useResponsive } from '../hooks/useResponsive';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
  const { isTablet } = useResponsive();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return `${price}€`;
  };

  const isEventFull = event.registeredCount >= event.capacity;
  const spotsLeft = event.capacity - event.registeredCount;

  return (
    <TouchableOpacity 
      style={[
        commonStyles.eventCard, 
        styles.card,
        isTablet ? styles.cardTablet : styles.cardPhone
      ]} 
      onPress={onPress}
    >
      <Image 
        source={{ uri: event.image }} 
        style={[styles.image, isTablet && styles.imageTablet]} 
      />
      
      <View style={[styles.content, isTablet && styles.contentTablet]}>
        <View style={styles.header}>
          <Text 
            style={[styles.title, isTablet && styles.titleTablet]} 
            numberOfLines={2}
          >
            {event.title}
          </Text>
          <Text style={[styles.price, isTablet && styles.priceTablet]}>
            {formatPrice(event.price)}
          </Text>
        </View>
        
        <Text style={[styles.chef, isTablet && styles.chefTablet]}>
          Chef {event.chef}
        </Text>
        
        <View style={styles.infoRow}>
          <Icon 
            name="time-outline" 
            size={isTablet ? 18 : 16} 
            color={colors.textLight} 
          />
          <Text 
            style={[styles.infoText, isTablet && styles.infoTextTablet]}
            numberOfLines={1}
          >
            {formatDate(event.date)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon 
            name="location-outline" 
            size={isTablet ? 18 : 16} 
            color={colors.textLight} 
          />
          <Text 
            style={[styles.infoText, isTablet && styles.infoTextTablet]} 
            numberOfLines={1}
          >
            {event.location}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.capacityInfo}>
            <Icon 
              name="people-outline" 
              size={isTablet ? 18 : 16} 
              color={colors.textLight} 
            />
            <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>
              {isEventFull ? 'Complet' : `${spotsLeft} place${spotsLeft > 1 ? 's' : ''} restante${spotsLeft > 1 ? 's' : ''}`}
            </Text>
          </View>
          
          {event.ratingCount > 0 && (
            <View style={styles.rating}>
              <Icon 
                name="star" 
                size={isTablet ? 18 : 16} 
                color={colors.accent} 
              />
              <Text style={[styles.ratingText, isTablet && styles.ratingTextTablet]}>
                {event.ratingAvg.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
  },
  cardPhone: {
    marginHorizontal: 20,
  },
  cardTablet: {
    marginHorizontal: 0,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.grey,
  },
  imageTablet: {
    height: 250,
  },
  content: {
    padding: 16,
  },
  contentTablet: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  titleTablet: {
    fontSize: 22,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  priceTablet: {
    fontSize: 22,
  },
  chef: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: 12,
  },
  chefTablet: {
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
    flex: 1,
  },
  infoTextTablet: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  capacityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 4,
  },
  ratingTextTablet: {
    fontSize: 16,
  },
});
