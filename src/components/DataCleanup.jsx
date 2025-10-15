import React, { useState } from 'react';
import { useDataManagement } from '../hooks/useICPDatabase';
import Button from './ui/Button';
import { Alert, AlertDescription } from './ui/alert';
import { Trash2, AlertTriangle } from 'lucide-react';

export const DataCleanupPanel = () => {
  const { deleteAllData, clearTestData, loading, error } = useDataManagement();
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');

  const handleDeleteUserData = async () => {
    const result = await deleteAllData();
    if (result.success) {
      setMessage('All your data has been deleted successfully.');
      // Redirect to onboarding or login
      setTimeout(() => {
        window.location.href = '/onboarding';
      }, 2000);
    } else if (!result.cancelled) {
      setMessage(`Error: ${result.error}`);
    }
  };

  const handleClearTestData = async () => {
    if (!adminSecret) {
      setMessage('Please enter admin secret');
      return;
    }

    const result = await clearTestData(adminSecret);
    if (result.success) {
      setMessage('Test data cleared successfully.');
      setAdminSecret('');
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Data Deletion */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Delete Your Data</h3>
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This will permanently delete all your data including profile, workouts, 
            achievements, and chat history. This action cannot be undone.
          </AlertDescription>
        </Alert>
        <Button
          onClick={handleDeleteUserData}
          disabled={loading}
          variant="destructive"
          className="w-full sm:w-auto"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete All My Data
        </Button>
      </div>

      {/* Admin Panel */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Admin Tools</h3>
        <div className="space-y-4">
          <Button
            onClick={() => setIsAdmin(!isAdmin)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isAdmin ? 'Hide' : 'Show'} Admin Panel
          </Button>

          {isAdmin && (
            <div className="space-y-4 mt-4">
              <input
                type="password"
                placeholder="Admin Secret"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <Button
                onClick={handleClearTestData}
                disabled={loading || !adminSecret}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                Clear All Test Data
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {(message || error) && (
        <Alert className={error ? 'border-red-500' : 'border-green-500'}>
          <AlertDescription>{message || error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DataCleanupPanel;
