import { User, Property, PropertyType, SearchFilters } from '../types.js';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('propspace_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Global request interceptor wrapper
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      // Body is not json or empty
    }

    if (response.status === 401 || response.status === 403) {
      // Auto logout if unauthenticated on protected routes
      localStorage.removeItem('propspace_token');
      localStorage.removeItem('propspace_user');
      // Dispatch custom event to notify App view of auth expiration
      window.dispatchEvent(new Event('auth_expired'));
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const AuthService = {
  async register(data: {
    email: string;
    username: string;
    name: string;
    phone: string;
    password: string;
    avatarUrl?: string;
  }): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const res = await request<{ token: string; user: Omit<User, 'passwordHash'> }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem('propspace_token', res.token);
    localStorage.setItem('propspace_user', JSON.stringify(res.user));
    return res;
  },

  async login(data: { emailOrUsername: string; password: string }): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const res = await request<{ token: string; user: Omit<User, 'passwordHash'> }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem('propspace_token', res.token);
    localStorage.setItem('propspace_user', JSON.stringify(res.user));
    return res;
  },

  async getMe(): Promise<Omit<User, 'passwordHash'>> {
    const user = await request<Omit<User, 'passwordHash'>>('/auth/me');
    localStorage.setItem('propspace_user', JSON.stringify(user));
    return user;
  },

  logout(): void {
    localStorage.removeItem('propspace_token');
    localStorage.removeItem('propspace_user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('propspace_token');
  },

  getCurrentUser(): Omit<User, 'passwordHash'> | null {
    const userJson = localStorage.getItem('propspace_user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },
};

export const UserService = {
  async updateProfile(data: { name: string; phone: string; avatarUrl?: string }): Promise<Omit<User, 'passwordHash'>> {
    const updatedUser = await request<Omit<User, 'passwordHash'>>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    localStorage.setItem('propspace_user', JSON.stringify(updatedUser));
    return updatedUser;
  },

  async changePassword(data: { oldPassword: string; newPassword: string }): Promise<{ message: string }> {
    return request<{ message: string }>('/users/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

export const PropertyService = {
  async getAll(filters: SearchFilters): Promise<Property[]> {
    const query = new URLSearchParams();
    if (filters.searchQuery) query.append('search', filters.searchQuery);
    if (filters.city) query.append('city', filters.city);
    if (filters.minPrice !== '') query.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== '') query.append('maxPrice', String(filters.maxPrice));
    if (filters.propertyType && filters.propertyType !== 'All') {
      query.append('propertyType', filters.propertyType);
    }

    const queryString = query.toString();
    return request<Property[]>(`/properties${queryString ? `?${queryString}` : ''}`);
  },

  async getMyListings(): Promise<Property[]> {
    return request<Property[]>('/properties/my-listings');
  },

  async create(data: {
    title: string;
    description: string;
    price: number;
    location: string;
    propertyType: PropertyType;
    imageUrls: string[];
  }): Promise<Property> {
    return request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      location?: string;
      propertyType?: PropertyType;
      imageUrls?: string[];
    }
  ): Promise<Property> {
    return request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/properties/${id}`, {
      method: 'DELETE',
    });
  },
};
