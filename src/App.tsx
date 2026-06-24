import React, { useState, useEffect } from 'react';
import { Search, Plus, SlidersHorizontal, MapPin, Building, Trash2, Edit3, LogIn, Sparkles, Filter, ShieldCheck, RefreshCw } from 'lucide-react';
import { Property, User as UserType, SearchFilters, PropertyType } from './types.js';
import Navbar from './components/Navbar.js';
import FilterSidebar from './components/FilterSidebar.js';
import PropertyCard from './components/PropertyCard.js';
import PropertyForm from './components/PropertyForm.js';
import AuthForm from './components/AuthForm.js';
import Dashboard from './components/Dashboard.js';
import FinanceCalculator from './components/FinanceCalculator.jsx';
import { PropertyService, AuthService } from './services/api.js';

export default function App() {
  
  const [currentTab, setCurrentTab] = useState<string>('feed'); // 'feed' | 'my-listings' | 'dashboard' | 'login' | 'register'
  
 
  const [currentUser, setCurrentUser] = useState<Omit<UserType, 'passwordHash'> | null>(null);
  
  // Listings state
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState('');

  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: 'All',
  });

  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  
  useEffect(() => {
    
    const savedUser = AuthService.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      
      AuthService.getMe()
        .then((user) => setCurrentUser(user))
        .catch(() => {
          // Expirations
          handleLogout();
        });
    }

    // Intercept 401/403 expirations
    const handleExpired = () => {
      handleLogout();
      setCurrentTab('login');
      alert('Your login session has expired. Please authenticate again.');
    };

    window.addEventListener('auth_expired', handleExpired);
    return () => window.removeEventListener('auth_expired', handleExpired);
  }, []);

 
  useEffect(() => {
    
    if ((currentTab === 'dashboard' || currentTab === 'my-listings') && !AuthService.isAuthenticated()) {
      setCurrentTab('login');
      return;
    }

    if (currentTab === 'feed') {
      fetchFeedProperties();
    } else if (currentTab === 'my-listings') {
      fetchMyProperties();
    }
  }, [currentTab]);

  const fetchFeedProperties = async () => {
    setLoading(true);
    setErrorString('');
    try {
      const data = await PropertyService.getAll(filters);
      setProperties(data);
    } catch (err: any) {
      setErrorString(err.message || 'Failed to fetch public listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProperties = async () => {
    setLoading(true);
    setErrorString('');
    try {
      const data = await PropertyService.getMyListings();
      setProperties(data);
    } catch (err: any) {
      setErrorString(err.message || 'Failed to fetch personal listings');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchFeedProperties();
  };

  const handleResetFilters = () => {
    const defaultFilters: SearchFilters = {
      searchQuery: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      propertyType: 'All',
    };
    setFilters(defaultFilters);
    // Fetch directly using empty filters
    setLoading(true);
    PropertyService.getAll(defaultFilters)
      .then((data) => setProperties(data))
      .catch((err) => setErrorString(err.message || 'Failed to query properties'))
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setCurrentTab('feed');
  };

  const handleAuthSuccess = (user: Omit<UserType, 'passwordHash'>) => {
    setCurrentUser(user);
    setCurrentTab('feed');
    fetchFeedProperties();
  };

  const handleProfileUpdated = (updatedUser: Omit<UserType, 'passwordHash'>) => {
    setCurrentUser(updatedUser);
  };

  // CRUD callbacks
  const handleOpenAddModal = () => {
    if (!currentUser) {
      setCurrentTab('login');
      return;
    }
    setEditingProperty(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (property: Property) => {
    setEditingProperty(property);
    setIsFormModalOpen(true);
  };

  const handlePropertySubmit = async (propertyData: {
    title: string;
    description: string;
    price: number;
    location: string;
    propertyType: PropertyType;
    imageUrls: string[];
  }) => {
    if (editingProperty) {
      // Update
      await PropertyService.update(editingProperty.id, propertyData);
    } else {
      // Create
      await PropertyService.create(propertyData);
    }
    // Refresh current view
    if (currentTab === 'my-listings') {
      fetchMyProperties();
    } else {
      fetchFeedProperties();
    }
  };

  const handlePropertyDelete = async (id: string) => {
    try {
      await PropertyService.delete(id);
      // Refresh current view
      if (currentTab === 'my-listings') {
        fetchMyProperties();
      } else {
        fetchFeedProperties();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  return (
    <div id="propspace-app" className="bg-slate-50 min-h-screen font-sans flex flex-col text-slate-800">
      
      {/* Global Navbar */}
      <Navbar
        currentUser={currentUser}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onLogout={handleLogout}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main Content Containers */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* VIEW 1: Explore Public Listing Feed */}
        {currentTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Desktop filter list column */}
            <div className="lg:col-span-1">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
            </div>

            {/* Main feed cards block */}
            <div className="lg:col-span-3 flex flex-col">
              
              {/* Header section with counter */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center space-x-2">
                    <span>Index of Properties</span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200/70 text-slate-705 rounded-full">
                      {properties.length} Available
                    </span>
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">Browse, view real-time estimates, and connect with listers.</p>
                </div>

                {currentUser && (
                  <button
                    onClick={handleOpenAddModal}
                    className="self-start sm:self-center flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Lister Portal</span>
                  </button>
                )}
              </div>

              {/* Status and listings representation */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-100 shadow-xs flex-grow">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                  <p className="text-slate-500 font-medium text-sm">Querying active database records...</p>
                </div>
              ) : errorString ? (
                <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-red-650 flex flex-col items-center justify-center text-center py-12">
                  <p className="font-bold text-base mb-1">Failed to query platform records</p>
                  <p className="text-sm">{errorString}</p>
                  <button 
                    onClick={fetchFeedProperties} 
                    className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg text-xs"
                  >
                    Retry Connection
                  </button>
                </div>
              ) : properties.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-150 p-12 text-center flex flex-col items-center justify-center flex-grow py-24">
                  <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl mb-4 border border-slate-100">
                    <Filter className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">No Listings Match Your Criteria</h3>
                  <p className="text-slate-500 text-sm max-w-sm mt-1 mb-6">
                    Try loosening your price bounds, changing your chosen property type, or clearing location fields.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Reset Search Criteria
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((p) => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      currentUser={currentUser}
                      onEdit={handleOpenEditModal}
                      onDelete={handlePropertyDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: My Personal Properties (Lister view) */}
        {currentTab === 'my-listings' && (
          <div className="flex flex-col">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 mb-8 gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center space-x-2">
                  <span>My Active Property Portfolios</span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {properties.length} Listings
                  </span>
                </h2>
                <p className="text-slate-500 text-xs mt-1">Manage listings, edit values, or delete items permanently.</p>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="flex items-center space-x-1.5 px-4  py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all self-start"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Publish New Listing</span>
              </button>
            </div>

            {/* My Listings details */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-100 shadow-xs">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                <p className="text-slate-500 font-medium text-sm">Loading your properties...</p>
              </div>
            ) : errorString ? (
              <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-red-650 flex flex-col items-center justify-center py-12 text-center">
                <p className="font-bold text-base mb-1">Failed to read personal portfolio</p>
                <p className="text-sm">{errorString}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center flex flex-col items-center justify-center py-20 max-w-lg mx-auto">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl mb-4">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">You Haven't Listed Any Properties</h3>
                <p className="text-slate-500 text-xs max-w-xs mt-2 mb-6">
                  List property apartments, townhouses, or studios to start receiving queries from buyers and renters.
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow animate-pulse"
                >
                  Publish First Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    currentUser={currentUser}
                    onEdit={handleOpenEditModal}
                    onDelete={handlePropertyDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: Interactive Real Estate Finance Center */}
        {currentTab === 'calculator' && (
          <FinanceCalculator />
        )}

        {/* VIEW 4: Account Metrics Settings (Protected Profile) */}
        {currentTab === 'dashboard' && currentUser && (
          <Dashboard
            currentUser={currentUser}
            onProfileUpdated={handleProfileUpdated}
          />
        )}

        {/* VIEW 4: Authentication - Sign In Pane */}
        {currentTab === 'login' && (
          <div className="py-8">
            <AuthForm
              initialMode="login"
              onSubmitSuccess={handleAuthSuccess}
              onToggleTab={setCurrentTab}
            />
          </div>
        )}

        {/* VIEW 5: Authentication - Register Pane */}
        {currentTab === 'register' && (
          <div className="py-8 font-sans">
            <AuthForm
              initialMode="register"
              onSubmitSuccess={handleAuthSuccess}
              onToggleTab={setCurrentTab}
            />
          </div>
        )}

      </main>

      {/* Global Bottom footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs font-medium text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight text-white">
                Prop<span className="text-blue-500">Space</span>
              </span>
              <span className="text-slate-650">•</span>
              <span>All rights reserved &copy; 2026</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('feed'); }} className="hover:text-white transition-colors">Find Properties</a>
              <span>•</span>
              <a href="#" onClick={(e) => { e.preventDefault(); handleOpenAddModal(); }} className="hover:text-white transition-colors">Listings Portal</a>
              <span>•</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('dashboard'); }} className="hover:text-white transition-colors">Lister Settings</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Reusable creation and update modal dialogue */}
      <PropertyForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handlePropertySubmit}
        editingProperty={editingProperty}
      />

    </div>
  );
}
