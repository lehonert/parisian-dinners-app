
import { Event, User, Registration, Review } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'chef@example.com',
    name: 'Marie Dubois',
    bio: 'Chef passionnée de cuisine française traditionnelle',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?w=150&h=150&fit=crop&crop=face',
    isAdmin: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Pierre Martin',
    bio: 'Amateur de bonne cuisine et de convivialité',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isAdmin: false,
    createdAt: new Date('2024-01-15'),
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Dîner Gastronomique d\'Automne',
    description: 'Une soirée exceptionnelle autour des saveurs automnales. Menu dégustation de 7 services préparé par notre chef étoilé Marie Dubois. Découvrez les champignons de saison, les courges rôties et les gibiers dans une ambiance chaleureuse et conviviale.',
    chef: 'Marie Dubois',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop',
    date: new Date('2024-02-15T19:30:00'),
    location: '15 Rue de la Paix, 75001 Paris',
    capacity: 20,
    price: 85,
    ratingAvg: 4.8,
    ratingCount: 12,
    createdBy: '1',
    createdAt: new Date('2024-01-20'),
    registeredCount: 18,
    waitlistCount: 3,
  },
  {
    id: '2',
    title: 'Atelier Pâtisserie Française',
    description: 'Apprenez les secrets de la pâtisserie française traditionnelle. Au programme : macarons, éclairs et mille-feuilles. Chaque participant repartira avec ses créations et les recettes détaillées.',
    chef: 'Antoine Leclerc',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=250&fit=crop',
    date: new Date('2024-02-20T14:00:00'),
    location: '8 Avenue des Champs-Élysées, 75008 Paris',
    capacity: 12,
    price: 65,
    ratingAvg: 4.6,
    ratingCount: 8,
    createdBy: '1',
    createdAt: new Date('2024-01-25'),
    registeredCount: 10,
    waitlistCount: 0,
  },
  {
    id: '3',
    title: 'Soirée Vins et Fromages',
    description: 'Découverte des accords parfaits entre vins français et fromages d\'exception. Dégustation commentée par notre sommelier expert avec une sélection de 6 vins et 8 fromages artisanaux.',
    chef: 'Julien Moreau',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=250&fit=crop',
    date: new Date('2024-01-10T18:00:00'),
    location: '22 Rue Saint-Germain, 75006 Paris',
    capacity: 15,
    price: 45,
    ratingAvg: 4.9,
    ratingCount: 15,
    createdBy: '1',
    createdAt: new Date('2023-12-15'),
    registeredCount: 15,
    waitlistCount: 0,
  },
];

export const mockRegistrations: Registration[] = [
  {
    id: '1',
    userId: '2',
    eventId: '1',
    status: 'confirmed',
    registeredAt: new Date('2024-01-22'),
  },
  {
    id: '2',
    userId: '2',
    eventId: '3',
    status: 'confirmed',
    registeredAt: new Date('2023-12-20'),
  },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '2',
    eventId: '3',
    rating: 5,
    comment: 'Soirée exceptionnelle ! Les accords étaient parfaits et l\'ambiance très conviviale. Je recommande vivement !',
    status: 'approved',
    createdAt: new Date('2024-01-12'),
    userName: 'Pierre Martin',
    userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
];

// Current user for demo purposes
export const currentUser: User = mockUsers[1]; // Pierre Martin
