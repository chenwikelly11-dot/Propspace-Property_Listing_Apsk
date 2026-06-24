export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  phone: string;
  avatarUrl: string;
  passwordHash: string;
  createdAt: string;
}

export type PropertyType = 'Apartment' | 'House' | 'Studio';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string; // city/country
  propertyType: PropertyType;
  imageUrls: string[];
  authorId: string;
  authorName: string;
  authorPhone: string;
  createdAt: string;
}

export interface AuthState {
  token: string | null;
  user: Omit<User, 'passwordHash'> | null;
}

export interface SearchFilters {
  searchQuery: string;
  city: string;
  minPrice: number | '';
  maxPrice: number | '';
  propertyType: PropertyType | 'All';
}
