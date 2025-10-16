import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useICPDatabase';
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';
import Icon from './AppIcon';

const DatabaseTest = () => {
    const { isAuthenticated, principal } = useAuth();
    const { profile, loading, createProfile } = useUserProfile();
    const [testResult, setTestResult] = useState(null);
    const [isTestingConnection, setIsTestingConnection] = useState(false);

    const testDatabaseConnection = async () => {
        setIsTestingConnection(true);
        setTestResult(null);

        try {
            // Test 1: Check authentication
            if (!isAuthenticated) {
                setTestResult({
                    success: false,
                    message: 'Not authenticated. Please login first.',
                    details: 'Authentication is required to access the database.'
                });
                return;
            }

            // Test 2: Check if profile exists
            if (profile) {
                setTestResult({
                    success: true,
                    message: 'Database connection successful!',
                    details: `Profile found for user: ${profile.username}`,
                    data: {
                        username: profile.username,
                        email: profile.email,
                        createdAt: profile.createdAt,
                        principal: principal?.toString()
                    }
                });
                return;
            }

            // Test 3: Try to create a test profile
            const testProfileData = {
                username: `TestUser_${Date.now()}`,
                email: `test_${Date.now()}@atosfit.app`,
                weight: 70,
                height: 175,
                age: 25,
                gender: 'other',
                activityLevel: 'moderate',
                fitnessGoal: 'general_fitness',
                preferences: {
                    workoutReminders: true,
                    preferredWorkoutTime: 'morning',
                    dietaryRestrictions: [],
                    injuryHistory: [],
                    equipmentAvailable: ['none']
                }
            };

            const result = await createProfile(testProfileData);

            if (result.success) {
                setTestResult({
                    success: true,
                    message: 'Database connection and write test successful!',
                    details: 'Successfully created test profile in the database.',
                    data: {
                        username: testProfileData.username,
                        principal: principal?.toString(),
                        action: 'Profile created'
                    }
                });
            } else {
                setTestResult({
                    success: false,
                    message: 'Database write test failed',
                    details: result.error || 'Unknown error occurred',
                    data: { principal: principal?.toString() }
                });
            }

        } catch (error) {
            setTestResult({
                success: false,
                message: 'Database connection test failed',
                details: error.message,
                data: { error: error.toString() }
            });
        } finally {
            setIsTestingConnection(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Database Connection Test</h3>
                <Button
                    onClick={testDatabaseConnection}
                    disabled={isTestingConnection || loading}
                    size="sm"
                    variant="outline"
                >
                    {isTestingConnection ? (
                        <div className="flex items-center space-x-2">
                            <LoadingSpinner size="sm" />
                            <span>Testing...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Icon name="Database" size={16} />
                            <span>Test Connection</span>
                        </div>
                    )}
                </Button>
            </div>

            {/* Authentication Status */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-foreground">
                        Authentication: {isAuthenticated ? 'Connected' : 'Not Connected'}
                    </span>
                </div>

                {isAuthenticated && (
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-foreground">
                            Principal: {principal?.toString().slice(0, 20)}...
                        </span>
                    </div>
                )}

                <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${profile ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm text-foreground">
                        Profile: {profile ? 'Found' : 'Not Found'}
                    </span>
                </div>
            </div>

            {/* Test Results */}
            {testResult && (
                <div className={`p-4 rounded-lg border ${testResult.success
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                    }`}>
                    <div className="flex items-start space-x-3">
                        <Icon
                            name={testResult.success ? "CheckCircle" : "XCircle"}
                            size={20}
                            className={testResult.success ? "text-green-500" : "text-red-500"}
                        />
                        <div className="flex-1">
                            <h4 className={`font-medium ${testResult.success ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                                }`}>
                                {testResult.message}
                            </h4>
                            <p className={`text-sm mt-1 ${testResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                                }`}>
                                {testResult.details}
                            </p>

                            {testResult.data && (
                                <div className="mt-3 p-3 bg-black/5 dark:bg-white/5 rounded border">
                                    <pre className="text-xs text-muted-foreground overflow-x-auto">
                                        {JSON.stringify(testResult.data, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Test Instructions:</h4>
                <ol className="text-xs text-muted-foreground space-y-1">
                    <li>1. Make sure you're logged in with Internet Identity</li>
                    <li>2. Click "Test Connection" to verify database access</li>
                    <li>3. The test will check authentication and try to read/write data</li>
                    <li>4. Green status indicates successful connection</li>
                </ol>
            </div>
        </div>
    );
};

export default DatabaseTest;