'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../../firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
import { signOut } from 'firebase/auth';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        // Fetch user data from Firebase Realtime Database
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          console.log('Fetched user data:', data);
          if (data) {
            setUserData(data);
          }
          setLoading(false);
        }, (error) => {
          console.error('Error fetching user data:', error);
          setLoading(false);
        });
      } else {
        router.push('/signin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear session cookie through our API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Hard redirect to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">DarkStore Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Profile Section */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Name</label>
                    <p className="mt-1 text-sm text-gray-900">{userData?.businessName || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="mt-1 text-sm text-gray-900">{userData?.phoneNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Created</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-4">
                  <a
                    href="/windsurfMap"
                    className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    View Dark Store Map
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    Add New Warehouse
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    View Analytics
                  </a>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                {userData?.recentActivity ? (
                  <div className="space-y-4">
                    {userData.recentActivity.map((activity, index) => (
                      <div key={index} className={`border-l-4 border-${activity.type || 'gray'}-400 pl-3`}>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400">{activity.timestamp}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
