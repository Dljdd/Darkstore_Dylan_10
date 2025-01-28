'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';

export default function WorkflowPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-semibold mb-4">Welcome to DarkStore Workflow</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium text-indigo-700 mb-3">Quick Actions</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="/windsurfMap" className="text-indigo-600 hover:text-indigo-800">
                      View Dark Store Map
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800">
                      Add New Warehouse
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800">
                      View Analytics
                    </a>
                  </li>
                </ul>
              </div>

              {/* Recent Activity */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium text-green-700 mb-3">Recent Activity</h2>
                <ul className="space-y-2">
                  <li className="text-green-600">New warehouse added in Mumbai</li>
                  <li className="text-green-600">Updated storage capacity</li>
                  <li className="text-green-600">Inventory check completed</li>
                </ul>
              </div>

              {/* System Status */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium text-blue-700 mb-3">System Status</h2>
                <ul className="space-y-2">
                  <li className="text-blue-600">All systems operational</li>
                  <li className="text-blue-600">Last sync: 5 minutes ago</li>
                  <li className="text-blue-600">No pending alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
