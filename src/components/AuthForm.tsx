import React, { useState } from 'react';
import { Home, HelpCircle, Eye, EyeOff, User, Mail, Shield, Phone, Image } from 'lucide-react';
import InputField from './InputField.js';

interface AuthFormProps {
  initialMode?: 'login' | 'register';
  onSubmitSuccess: (user: any) => void;
  onToggleTab: (tabId: string) => void;
}

export default function AuthForm({
  initialMode = 'login',
  onSubmitSuccess,
  onToggleTab,
}: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login values
  const [loginCredential, setLoginCredential] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register values
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAvatarUrl, setRegAvatarUrl] = useState('');

  // UI state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setValidationErrors({});
    setApiError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setValidationErrors({});

    // Validate
    const errors: Record<string, string> = {};
    if (!loginCredential.trim()) {
      errors.loginCredential = 'Email or username is required';
    }
    if (!loginPassword) {
      errors.loginPassword = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrUsername: loginCredential.trim(),
          password: loginPassword,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to authenticate');
      }

      // Persist locally
      localStorage.setItem('propspace_token', resData.token);
      localStorage.setItem('propspace_user', JSON.stringify(resData.user));
      
      onSubmitSuccess(resData.user);
    } catch (err: any) {
      setApiError(err.message || 'Login failed, please check your details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setValidationErrors({});

    // Client-side dry validations
    const errors: Record<string, string> = {};

    if (!regEmail.trim()) {
      errors.regEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(regEmail)) {
      errors.regEmail = 'Please provide a valid email format';
    }

    if (!regUsername.trim()) {
      errors.regUsername = 'Username is required';
    } else if (regUsername.trim().length < 3) {
      errors.regUsername = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(regUsername)) {
      errors.regUsername = 'Username can only contain letters, numbers, and underscores';
    }

    if (!regName.trim()) {
      errors.regName = 'Full name is required';
    }

    if (!regPassword) {
      errors.regPassword = 'Password is required';
    } else if (regPassword.length < 6) {
      errors.regPassword = 'Password must be at least 6 characters long';
    }

    if (regPassword !== regConfirmPassword) {
      errors.regConfirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regEmail.trim(),
          username: regUsername.trim().toLowerCase(),
          name: regName.trim(),
          phone: regPhone.trim(),
          password: regPassword,
          avatarUrl: regAvatarUrl.trim() || undefined,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Registration failed');
      }

      // Persist locally
      localStorage.setItem('propspace_token', resData.token);
      localStorage.setItem('propspace_user', JSON.stringify(resData.user));

      onSubmitSuccess(resData.user);
    } catch (err: any) {
      setApiError(err.message || 'Registration failed, please change your username or email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-md">
      {/* Visual Identity Logo representation */}
      <div className="text-center mb-6">
        <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-xl mb-3 border border-blue-100">
          <Home className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {mode === 'login'
            ? 'Sign in to access your dashboard and publish property listings'
            : 'Join PropSpace today and index your properties for free'}
        </p>
      </div>

      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-650 rounded-lg text-xs font-semibold leading-relaxed">
          {apiError}
        </div>
      )}

      {mode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <InputField
            id="login-credential"
            label="Username or Email Address"
            placeholder="e.g. yohprecious10@gmail.com"
            value={loginCredential}
            onChange={setLoginCredential}
            error={validationErrors.loginCredential}
            required
          />

          <InputField
            id="login-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={loginPassword}
            onChange={setLoginPassword}
            error={validationErrors.loginPassword}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <InputField
            id="reg-email"
            label="Email Address"
            placeholder="e.g. user@domain.com"
            value={regEmail}
            onChange={setRegEmail}
            error={validationErrors.regEmail}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField
              id="reg-username"
              label="Username"
              placeholder="e.g. john_doe"
              value={regUsername}
              onChange={setRegUsername}
              error={validationErrors.regUsername}
              required
            />

            <InputField
              id="reg-name"
              label="Full Name"
              placeholder="e.g. John Doe"
              value={regName}
              onChange={setRegName}
              error={validationErrors.regName}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField
              id="reg-phone"
              label="Phone Number"
              placeholder="+1 555-0199"
              value={regPhone}
              onChange={setRegPhone}
              error={validationErrors.regPhone}
            />

            <InputField
              id="reg-avatar"
              label="Avatar URL (Optional)"
              placeholder="https://images.unsplash..."
              value={regAvatarUrl}
              onChange={setRegAvatarUrl}
              error={validationErrors.regAvatar}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField
              id="reg-password"
              label="Password"
              type="password"
              placeholder="At least 6 chars"
              value={regPassword}
              onChange={setRegPassword}
              error={validationErrors.regPassword}
              required
            />

            <InputField
              id="reg-confirm"
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={regConfirmPassword}
              onChange={setRegConfirmPassword}
              error={validationErrors.regConfirmPassword}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      )}

      {/* Toggle View Link footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        <button
          onClick={toggleMode}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none"
        >
          {mode === 'login'
            ? "Don't have an account? Sign Up for Free"
            : 'Got an account already? Sign In here'}
        </button>
      </div>
    </div>
  );
}
