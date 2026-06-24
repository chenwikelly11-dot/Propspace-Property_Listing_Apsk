import React, { useState } from 'react';
import { User as UserIcon, Lock, Save, Sparkles, Phone, Image, CheckCircle } from 'lucide-react';
import { User as UserType } from '../types.js';
import InputField from './InputField.js';
import { UserService } from '../services/api.js';

interface DashboardProps {
  currentUser: Omit<UserType, 'passwordHash'>;
  onProfileUpdated: (updatedUser: any) => void;
}

export default function Dashboard({ currentUser, onProfileUpdated }: DashboardProps) {
  // Tabs: 'profile' | 'password'
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'password'>('profile');

  // Profile forms
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  
  // Password forms
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setFormErrors({});

    if (!name.trim()) {
      setFormErrors({ name: 'Full name is required' });
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await UserService.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      });
      onProfileUpdated(updated);
      setMessage({ type: 'success', content: 'Profile metrics updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', content: err.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setFormErrors({});

    const errors: Record<string, string> = {};
    if (!oldPassword) errors.oldPassword = 'Current password is required';
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters long';
    }
    if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await UserService.changePassword({ oldPassword, newPassword });
      setMessage({ type: 'success', content: 'Password changed successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', content: err.message || 'Verification failed. Incorrect old password.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        
        {/* Profile Card Header Banner */}
        <div className="bg-slate-900 px-6 py-8 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.username}`;
              }}
            />
            <div>
              <h2 className="text-xl font-bold tracking-tight">{currentUser.name}</h2>
              <p className="text-xs text-slate-400 mt-1">@{currentUser.username} • Account Owner</p>
            </div>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs text-xs">
            <span className="font-semibold text-slate-300">Email:</span> {currentUser.email}
          </div>
        </div>

        {/* Workspace Layout Columns splits tab list and form fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[400px]">
          {/* Sidebar Tab List */}
          <div className="border-r border-slate-100 bg-slate-50/50 p-4 space-y-1">
            <button
              onClick={() => {
                setActiveSubTab('profile');
                setMessage(null);
                setFormErrors({});
              }}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeSubTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Edit Profile Details</span>
            </button>
            <button
              onClick={() => {
                setActiveSubTab('password');
                setMessage(null);
                setFormErrors({});
              }}
              className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeSubTab === 'password'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security Settings</span>
            </button>
          </div>

          {/* Form Content pane */}
          <div className="md:col-span-3 p-6 md:p-8">
            {message && (
              <div
                className={`mb-6 p-4 rounded-xl border text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-blue-550 border-blue-100 text-blue-750 flex items-center space-x-2'
                    : 'bg-red-50 border-red-150 text-red-700'
                }`}
              >
                {message.type === 'success' && <CheckCircle className="w-4 h-4 text-blue-600" />}
                <span>{message.content}</span>
              </div>
            )}

            {activeSubTab === 'profile' ? (
              <form onSubmit={handleProfileSubmit}>
                <div className="flex items-center space-x-1.5 border-b border-slate-100 pb-3 mb-6">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-850 text-base">Account Configuration Metrics</h3>
                </div>

                <div className="space-y-4 max-w-lg">
                  <InputField
                    id="profile-name"
                    label="Full Contact Name"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={setName}
                    error={formErrors.name}
                    required
                  />

                  <InputField
                    id="profile-phone"
                    label="Contact Phone Cell Number"
                    placeholder="e.g. +1 555-0199"
                    value={phone}
                    onChange={setPhone}
                  />

                  <InputField
                    id="profile-avatar"
                    label="Personal Avatar Image URL"
                    placeholder="https://images.unsplash.com/..."
                    value={avatarUrl}
                    onChange={setAvatarUrl}
                  />

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm active:scale-[0.98] transition-all flex items-center space-x-1"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSubmitting ? 'Saving modifications...' : 'Save Profile Metrics'}</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit}>
                <div className="flex items-center space-x-1.5 border-b border-slate-100 pb-3 mb-6">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-850 text-base">Security Adjustment Controls</h3>
                </div>

                <div className="space-y-4 max-w-lg">
                  <InputField
                    id="pwd-old"
                    label="Current Password"
                    type="password"
                    placeholder="Verify original account credentials"
                    value={oldPassword}
                    onChange={setOldPassword}
                    error={formErrors.oldPassword}
                    required
                  />

                  <div className="h-[1px] bg-slate-100"></div>

                  <InputField
                    id="pwd-new"
                    label="New Password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={setNewPassword}
                    error={formErrors.newPassword}
                    required
                  />

                  <InputField
                    id="pwd-confirm"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Re-enter new account password"
                    value={confirmNewPassword}
                    onChange={setConfirmNewPassword}
                    error={formErrors.confirmNewPassword}
                    required
                  />

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm active:scale-[0.98] transition-all flex items-center space-x-1"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSubmitting ? 'Verifying & Saving...' : 'Change Password'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
