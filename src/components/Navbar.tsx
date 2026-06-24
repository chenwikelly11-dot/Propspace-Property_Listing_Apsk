import React, { useState } from 'react';
import { Home, User, LogOut, Plus, Search, Building2, Menu, X, Calculator } from 'lucide-react';
import { User as UserType } from '../types.js';

interface NavbarProps {
  currentUser: Omit<UserType, 'passwordHash'> | null;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onOpenAddModal: () => void;
}

export default function Navbar({
  currentUser,
  currentTab,
  onTabChange,
  onLogout,
  onOpenAddModal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'feed', label: 'Explore Feed', icon: Search, guestVisible: true },
    { id: 'calculator', label: 'Finance Hub', icon: Calculator, guestVisible: true },
    { id: 'my-listings', label: 'My Listings', icon: Building2, guestVisible: false },
    { id: 'dashboard', label: 'My Dashboard', icon: User, guestVisible: false },
  ];

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('feed')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors focus:outline-none"
            >
              <div className="p-2 bg-blue-50 rounded-lg">
                <Home className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">
                Prop<span className="text-blue-600">Space</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              if (!item.guestVisible && !currentUser) return null;
              const IconComp = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Controls Section */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <>
                <button
                  onClick={onOpenAddModal}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Property</span>
                </button>

                <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

                <div className="flex items-center space-x-3 pl-1">
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 group"
                  >
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.username}`;
                      }}
                      className="w-8 h-8 rounded-full object-cover border border-slate-100 group-hover:border-blue-400 group-hover:scale-105 transition-all"
                    />
                    <div className="text-left leading-none">
                      <p className="text-xs text-slate-400 font-medium">Account</p>
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                        {currentUser.name}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-2 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            if (!item.guestVisible && !currentUser) return null;
            const IconComp = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-2 w-full px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <IconComp className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {currentUser ? (
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center px-4 space-x-3 mb-2">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100"
                />
                <div>
                  <p className="text-base font-semibold text-slate-800 leading-none">{currentUser.name}</p>
                  <p className="text-xs text-slate-400 mt-1">@{currentUser.username}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAddModal();
                }}
                className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-sm text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>List Property</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col space-y-2 px-4">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 text-center text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="w-full py-2.5 text-center text-sm font-medium bg-blue-600 text-white rounded-lg shadow-sm"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
