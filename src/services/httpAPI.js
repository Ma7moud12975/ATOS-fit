/**
 * HTTP-based API service for ATOS-fit
 * Uses direct HTTPS requests to canister instead of Candid interface
 */

// Get canister configuration
const BACKEND_CANISTER_ID = import.meta.env.VITE_BACKEND_CANISTER_ID || 'uzt4z-lp777-77774-qaabq-cai';
const IC_HOST = import.meta.env.VITE_IC_HOST || 'http://localhost:8000';

// Determine if we're on IC mainnet or local
const isMainnet = import.meta.env.VITE_DFX_NETWORK === 'ic' || import.meta.env.MODE === 'production';

// Build the base URL for HTTP requests
const getBaseURL = () => {
  if (isMainnet) {
    return `https://${BACKEND_CANISTER_ID}.ic0.app`;
  } else {
    return `${IC_HOST}`;
  }
};

// Helper function to make HTTP requests to canister
const makeCanisterRequest = async (path, options = {}) => {
  const baseURL = getBaseURL();
  let url;
  
  if (isMainnet) {
    // On mainnet, use direct canister URL
    url = `${baseURL}${path}`;
  } else {
    // On local, use canister ID parameter
    url = `${baseURL}${path}?canisterId=${BACKEND_CANISTER_ID}`;
  }

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  console.log('Making HTTP request to:', url);
  console.log('Request options:', requestOptions);

  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('HTTP request failed:', error);
    throw error;
  }
};

// ============ HTTP API FUNCTIONS ============

export const httpAPI = {
  /**
   * Test connection to canister via HTTP
   */
  testConnection: async () => {
    try {
      const result = await makeCanisterRequest('/api/health');
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get total users via HTTP
   */
  getTotalUsers: async () => {
    try {
      const result = await makeCanisterRequest('/api/users/total');
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create user profile via HTTP
   */
  createUserProfile: async (profileData) => {
    try {
      const result = await makeCanisterRequest('/api/users/profile', {
        method: 'POST',
        body: JSON.stringify(profileData),
      });
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user profile via HTTP
   */
  getUserProfile: async () => {
    try {
      const result = await makeCanisterRequest('/api/users/profile', {
        method: 'GET',
      });
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Generic HTTP request to canister
   */
  request: async (path, options = {}) => {
    try {
      const result = await makeCanisterRequest(path, options);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============ UTILITY FUNCTIONS ============

/**
 * Check if HTTP API is available
 */
export const isHttpAPIAvailable = async () => {
  try {
    const result = await httpAPI.testConnection();
    return result.success;
  } catch (error) {
    return false;
  }
};

/**
 * Get canister info
 */
export const getCanisterInfo = () => {
  return {
    canisterId: BACKEND_CANISTER_ID,
    host: IC_HOST,
    baseURL: getBaseURL(),
    isMainnet,
  };
};

export default httpAPI;