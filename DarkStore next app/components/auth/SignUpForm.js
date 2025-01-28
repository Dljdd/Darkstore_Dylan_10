'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { getDatabase, ref, set } from 'firebase/database';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Building2, Phone } from 'lucide-react';

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Get the user object
      const user = userCredential.user;

      // Add additional user data to Realtime Database
      const db = getDatabase();
      await set(ref(db, `users/${user.uid}`), {
        email: formData.email,
        businessName: formData.businessName,
        phoneNumber: formData.phoneNumber,
        role: 'user',
        createdAt: new Date().toISOString()
      });

      // Set session cookie
      const idToken = await user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Sign up error:', error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      default:
        return 'An error occurred during sign up. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95 p-4">
      <div className="w-full max-w-md space-y-8 bg-black border border-neutral-800 p-8 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded-lg" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 py-2"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 py-2"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="businessName" className="text-sm font-medium text-neutral-300">
                Business Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  className="pl-10 w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 py-2"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium text-neutral-300">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="pl-10 w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 py-2"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/signin" 
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-300"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
