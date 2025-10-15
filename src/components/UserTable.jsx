import React, { useState, useEffect } from 'react';
import { getBackendActor } from '../services/canisterAPI';
import LoadingSpinner from './ui/LoadingSpinner';
import Icon from './AppIcon';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const actor = await getBackendActor();
      
      // Get total user count
      const total = await actor.getTotalUsers();
      setTotalUsers(Number(total));
      
      // Note: For privacy reasons, we can't fetch all user profiles
      // This is just a demonstration of the connection
      setUsers([]);
      
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(Number(timestamp) / 1000000); // Convert from nanoseconds
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-muted-foreground">Loading user data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center py-8 text-destructive">
          <Icon name="AlertCircle" size={20} />
          <span className="ml-2">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Database Connection Status</h3>
            <p className="text-sm text-muted-foreground">
              Connected to Internet Computer canister
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Icon name="RefreshCw" size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-muted/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <Icon name="Database" size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Database Status</p>
              <p className="text-xs text-green-500">Connected</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Icon name="Users" size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Total Users</p>
              <p className="text-xs text-muted-foreground">{totalUsers}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Authentication</p>
              <p className="text-xs text-purple-500">Internet Identity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="px-6 py-4">
        <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Icon name="Info" size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Privacy Protected
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              User profiles are private and can only be accessed by their respective owners. 
              This table shows connection status and aggregate statistics only.
            </p>
          </div>
        </div>
      </div>

      {/* User Profile Structure */}
      <div className="px-6 py-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">User Profile Fields</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="space-y-1">
            <div>• Full Name (required)</div>
            <div>• Email Address (optional)</div>
            <div>• Age</div>
            <div>• Height (cm)</div>
            <div>• Weight (kg)</div>
          </div>
          <div className="space-y-1">
            <div>• Gender (Male/Female/Other)</div>
            <div>• Activity Level</div>
            <div>• Primary Goals (multiple)</div>
            <div>• Preferred Workout Time</div>
            <div>• Workout Reminders</div>
          </div>
        </div>
      </div>

      {/* Connection Details */}
      <div className="px-6 py-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Connection Details</h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Canister Type:</span>
            <span className="font-mono">Motoko</span>
          </div>
          <div className="flex justify-between">
            <span>Network:</span>
            <span className="font-mono">
              {import.meta.env.VITE_DFX_NETWORK === 'ic' ? 'Internet Computer Mainnet' : 'Local Development'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Backend Canister:</span>
            <span className="font-mono text-xs">
              {import.meta.env.VITE_BACKEND_CANISTER_ID || 'Local'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;