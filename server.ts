import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { jsonDb } from './src/db/jsonDb.js';
import { Property, PropertyType, User } from './src/types.js';


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
      };
    }
  }
}

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'propspace-fallback-secret-development';

app.use(express.json());

// Auth Middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };
    next();
  });
}

// ================= AUTH ENDPOINTS =================

// Register User
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, username, password, name, phone, avatarUrl } = req.body;

  if (!email || !username || !password || !name) {
    return res.status(400).json({ error: 'Email, username, password, and name are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  // Check unique email and username
  if (jsonDb.getUserByEmail(email)) {
    return res.status(400).json({ error: 'Email is already taken' });
  }
  if (jsonDb.getUserByUsername(username)) {
    return res.status(400).json({ error: 'Username is already taken' });
  }

  const id = 'user_' + Math.random().toString(36).substr(2, 9);
  const passwordHash = bcrypt.hashSync(password, 10);

  const newUser: User = {
    id,
    email,
    username,
    name,
    phone: phone || '',
    avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  jsonDb.addUser(newUser);

  // Generate JWT token
  const token = jwt.sign({ id, email, username }, JWT_SECRET, { expiresIn: '7d' });

  // Exclude password hash from response
  const { passwordHash: _, ...userWithoutHash } = newUser;

  res.status(201).json({
    token,
    user: userWithoutHash,
  });
});

// Login User
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required' });
  }

  // Find user by email or username
  let user = jsonDb.getUserByEmail(emailOrUsername);
  if (!user) {
    user = jsonDb.getUserByUsername(emailOrUsername);
  }

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email/username or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

  const { passwordHash: _, ...userWithoutHash } = user;

  res.status(200).json({
    token,
    user: userWithoutHash,
  });
});

// Get Logged-in User Profile
app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
  const user = jsonDb.getUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { passwordHash: _, ...userWithoutHash } = user;
  res.status(200).json(userWithoutHash);
});

// Update Account Profile
app.put('/api/users/profile', authenticateToken, (req: Request, res: Response) => {
  const { name, phone, avatarUrl } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const updatedUser = jsonDb.updateUser(req.user!.id, {
    name,
    phone: phone || '',
    avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${req.user!.username}`,
  });

  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update properties embedded details
  const allProperties = jsonDb.getProperties();
  allProperties.forEach((p) => {
    if (p.authorId === req.user!.id) {
      jsonDb.updateProperty(p.id, {
        authorName: name,
        authorPhone: phone || '',
      });
    }
  });

  const { passwordHash: _, ...userWithoutHash } = updatedUser;
  res.status(200).json(userWithoutHash);
});

// Change Password
app.put('/api/users/password', authenticateToken, (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  const user = jsonDb.getUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!bcrypt.compareSync(oldPassword, user.passwordHash)) {
    return res.status(400).json({ error: 'Incorrect current password' });
  }

  const newPasswordHash = bcrypt.hashSync(newPassword, 10);
  jsonDb.updateUser(req.user!.id, { passwordHash: newPasswordHash });

  res.status(200).json({ message: 'Password changed successfully' });
});


// ================= PROPERTY ENDPOINTS =================

// Public Property Feed (Read API)
app.get('/api/properties', (req: Request, res: Response) => {
  let listings = jsonDb.getProperties();

  // Filter application query parameters
  const { search, city, minPrice, maxPrice, propertyType } = req.query;

  if (search) {
    const q = String(search).toLowerCase();
    listings = listings.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (city) {
    const c = String(city).toLowerCase();
    listings = listings.filter((p) => p.location.toLowerCase().includes(c));
  }

  if (minPrice) {
    const min = parseFloat(String(minPrice));
    if (!isNaN(min)) {
      listings = listings.filter((p) => p.price >= min);
    }
  }

  if (maxPrice) {
    const max = parseFloat(String(maxPrice));
    if (!isNaN(max)) {
      listings = listings.filter((p) => p.price <= max);
    }
  }

  if (propertyType && propertyType !== 'All') {
    listings = listings.filter((p) => p.propertyType === propertyType);
  }

  res.status(200).json(listings);
});

// Private User Listings (Read API)
app.get('/api/properties/my-listings', authenticateToken, (req: Request, res: Response) => {
  const listings = jsonDb.getProperties().filter((p) => p.authorId === req.user!.id);
  res.status(200).json(listings);
});

// Create Property Listing
app.post('/api/properties', authenticateToken, (req: Request, res: Response) => {
  const { title, description, price, location, propertyType, imageUrls } = req.body;

  if (!title || !description || price === undefined || !location || !propertyType) {
    return res.status(400).json({ error: 'Missing required property details' });
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  if (!['Apartment', 'House', 'Studio'].includes(propertyType)) {
    return res.status(400).json({ error: 'Property type must be Apartment, House, or Studio' });
  }

  const user = jsonDb.getUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const propertyId = 'prop_' + Math.random().toString(36).substr(2, 9);
  const finalImageUrls = Array.isArray(imageUrls) && imageUrls.length > 0 
    ? imageUrls.filter(Boolean) 
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'];

  const newProperty: Property = {
    id: propertyId,
    title,
    description,
    price: parsedPrice,
    location,
    propertyType: propertyType as PropertyType,
    imageUrls: finalImageUrls,
    authorId: user.id,
    authorName: user.name,
    authorPhone: user.phone,
    createdAt: new Date().toISOString(),
  };

  jsonDb.addProperty(newProperty);
  res.status(201).json(newProperty);
});

// Update Property Listing
app.put('/api/properties/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, price, location, propertyType, imageUrls } = req.body;

  const property = jsonDb.getPropertyById(id);
  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  // Ensure owner is modifying
  if (property.authorId !== req.user!.id) {
    return res.status(403).json({ error: 'You are not authorized to update this listing' });
  }

  const updates: Partial<Omit<Property, 'id' | 'authorId' | 'createdAt'>> = {};

  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (location !== undefined) updates.location = location;

  if (price !== undefined) {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    updates.price = parsedPrice;
  }

  if (propertyType !== undefined) {
    if (!['Apartment', 'House', 'Studio'].includes(propertyType)) {
      return res.status(400).json({ error: 'Property type must be Apartment, House, or Studio' });
    }
    updates.propertyType = propertyType as PropertyType;
  }

  if (imageUrls !== undefined) {
    updates.imageUrls = Array.isArray(imageUrls) && imageUrls.length > 0 
      ? imageUrls.filter(Boolean)
      : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'];
  }

  const updated = jsonDb.updateProperty(id, updates);
  res.status(200).json(updated);
});

// Delete Property Listing
app.delete('/api/properties/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const property = jsonDb.getPropertyById(id);

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  // Ensure owner is deleting
  if (property.authorId !== req.user!.id) {
    return res.status(403).json({ error: 'You are not authorized to delete this listing' });
  }

  jsonDb.deleteProperty(id);
  res.status(200).json({ message: 'Property listing deleted successfully' });
});


// ================= VITE OR STATIC SERVING =================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
