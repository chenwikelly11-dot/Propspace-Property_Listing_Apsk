import fs from 'fs';
import path from 'path';
import { User, Property } from '../types.js';

const DB_FILE = path.join(process.cwd(), 'database_store.json');

interface DatabaseSchema {
  users: User[];
  properties: Property[];
}

function initDb(): DatabaseSchema {
  const seedProperties: Property[] = [
    {
      id: 'prop-seed-1',
      title: 'Luxury Family Mansion in Bastos',
      description: 'Stunning 5-bedroom modern mansion situated in the premium diplomatic neighborhood of Bastos, Yaoundé. Features a spacious private swimming pool, double garage, integrated solar standby energy backups, high-speed fiber internet, and professional 24/7 security safeguards. Highly suitable for executive living or embassies.',
      price: 250000000,
      location: 'Bastos, Yaoundé, Cameroon',
      propertyType: 'House',
      imageUrls: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
      ],
      authorId: 'admin-seed',
      authorName: 'PropSpace Premium Cameroonian Properties',
      authorPhone: '+237 677 889 900',
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'prop-seed-2',
      title: 'Chic Executive Studio Apartment in Akwa',
      description: 'Elegant, newly built fully furnished studio apartment located in the prime business hub of Akwa, Douala. Fully air-conditioned, modern European kitchen layout, secure digital card access, private balcony, and uninterrupted water supply via specialized boreholes.',
      price: 350000,
      location: 'Akwa, Douala, Cameroon',
      propertyType: 'Studio',
      imageUrls: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
      ],
      authorId: 'admin-seed',
      authorName: 'PropSpace Premium Cameroonian Properties',
      authorPhone: '+237 677 889 900',
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'prop-seed-3',
      title: 'Waterfront Penthouse near Limbe Beach',
      description: 'Breath-taking 3-bedroom luxury penthouse overlooking the Atlantic Coast, just a short drive from Buea. Comes with wrap-around balconies, floor-to-ceiling glass paneling, ultra-premium appliances, private parking, and beautiful ocean sunsets every evening.',
      price: 85000000,
      location: 'Limbe (near Buea), Cameroon',
      propertyType: 'Apartment',
      imageUrls: [
        'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
      ],
      authorId: 'admin-seed',
      authorName: 'PropSpace Premium Cameroonian Properties',
      authorPhone: '+237 677 889 900',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'prop-seed-4',
      title: 'Luxury 4-Bedroom Villa with Pool in Lekki Phase 1',
      description: 'State-of-the-art detached family villa in high-brow Lekki Phase 1, Lagos, Nigeria. Highlights include automated smart-home systems, fitted cinema theatre room, gorgeous marble floors, fully fitted professional kitchen, swimming pool, and dedicated staff quarters.',
      price: 185000000,
      location: 'Lekki Phase 1, Lagos, Nigeria',
      propertyType: 'House',
      imageUrls: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
      ],
      authorId: 'admin-seed',
      authorName: 'West Africa Prime Realty',
      authorPhone: '+234 803 123 4567',
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'prop-seed-5',
      title: 'Modern High-Rise Apartment in Manhattan',
      description: 'Sophisticated 2-bedroom high-rise apartment located in the prestigious Midtown Manhattan, New York. Incredible panoramic views of the skyline through full-height window walls, rooftop gym access, private resident lounge, and full 24-hour concierge services.',
      price: 1450000,
      location: 'Manhattan, New York, USA',
      propertyType: 'Apartment',
      imageUrls: [
        'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
      ],
      authorId: 'admin-seed',
      authorName: 'Global Bluechip Properties',
      authorPhone: '+1 (212) 555-0199',
      createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'prop-seed-6',
      title: 'Charming Studio in Bayswater near Hyde Park',
      description: 'Superbly renovated studio flat on the second floor of a beautiful Victorian conversion in Bayswater, London. Boasts high ceiling, oak hardwood floors, stylish modern custom shower, and is just a brief walk away from Hyde Park.',
      price: 375000,
      location: 'Bayswater, London, United Kingdom',
      propertyType: 'Studio',
      imageUrls: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
      ],
      authorId: 'admin-seed',
      authorName: 'UK Residential Portfolios',
      authorPhone: '+44 20 7946 0958',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'prop-seed-7',
      title: 'Premium Apartment close to Eiffel Tower',
      description: 'Superb classic French apartment located in the sought-after 7th Arrondissement of Paris, France. High ornate ceilings, authentic fireplaces, parquet de Versailles flooring, and magnificent romantic views of the Eiffel Tower from the master balcony.',
      price: 1100000,
      location: '7th Arrondissement, Paris, France',
      propertyType: 'Apartment',
      imageUrls: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&w=1200&q=80'
      ],
      authorId: 'admin-seed',
      authorName: 'Prestige European Estates',
      authorPhone: '+33 1 42 27 78 90',
      createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'prop-seed-8',
      title: 'Executive Studio Flat in Kilimani',
      description: 'Fabulous high-end furnished studio flat in the heart of Kilimani, Nairobi, Kenya. Equipped with heated indoor swimming pools, well-equipped rooftop gymnasium, high speed lifts, smart intercom systems, and clean backup water tanks.',
      price: 8200000,
      location: 'Kilimani, Nairobi, Kenya',
      propertyType: 'Studio',
      imageUrls: [
        'https://images.unsplash.com/photo-1560185127-b272c68e8c9a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
      ],
      authorId: 'admin-seed',
      authorName: 'East Africa Prime Listings',
      authorPhone: '+254 20 123 4567',
      createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
    }
  ];

  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      
      const loadedProperties = parsed.properties && parsed.properties.length > 0
        ? parsed.properties
        : seedProperties;

      return {
        users: parsed.users || [],
        properties: loadedProperties,
      };
    }
  } catch (err) {
    console.error('Error reading database, initializing empty DB:', err);
  }

  const defaultDb: DatabaseSchema = { users: [], properties: seedProperties };
  saveDb(defaultDb);
  return defaultDb;
}

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database:', err);
  }
}

// Memory cache loaded on startup
const db = initDb();

export const jsonDb = {
  getUsers(): User[] {
    return db.users;
  },

  getUserById(id: string): User | undefined {
    return db.users.find((u) => u.id === id);
  },

  getUserByEmail(email: string): User | undefined {
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserByUsername(username: string): User | undefined {
    return db.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  },

  addUser(user: User): User {
    db.users.push(user);
    saveDb(db);
    return user;
  },

  updateUser(id: string, updates: Partial<Omit<User, 'id' | 'email' | 'username' | 'createdAt' | 'passwordHash'>> & { passwordHash?: string }): User | null {
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    db.users[idx] = {
      ...db.users[idx],
      ...updates,
    };
    saveDb(db);
    return db.users[idx];
  },

  getProperties(): Property[] {
    return db.properties;
  },

  getPropertyById(id: string): Property | undefined {
    return db.properties.find((p) => p.id === id);
  },

  addProperty(property: Property): Property {
    db.properties.push(property);
    saveDb(db);
    return property;
  },

  updateProperty(id: string, updates: Partial<Omit<Property, 'id' | 'authorId' | 'createdAt'>>): Property | null {
    const idx = db.properties.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    db.properties[idx] = {
      ...db.properties[idx],
      ...updates,
    };
    saveDb(db);
    return db.properties[idx];
  },

  deleteProperty(id: string): boolean {
    const idx = db.properties.findIndex((p) => p.id === id);
    if (idx === -1) return false;

    db.properties.splice(idx, 1);
    saveDb(db);
    return true;
  },
};
