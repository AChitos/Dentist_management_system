import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  specialization?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token by fetching user profile
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Login mutation
  const loginMutation = useMutation(
    async (credentials: LoginCredentials) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return response.json();
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        
        // Invalidate and refetch user-related queries
        queryClient.invalidateQueries(['user']);
        queryClient.invalidateQueries(['patients']);
        queryClient.invalidateQueries(['appointments']);
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Login failed');
      },
    }
  );

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear all queries from cache
    queryClient.clear();
    
    toast.success('Logged out successfully');
  };

  // Update profile mutation
  const updateProfileMutation = useMutation(
    async (data: Partial<User>) => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return response.json();
    },
    {
      onSuccess: (data) => {
        setUser(data.user);
        toast.success('Profile updated successfully!');
        queryClient.invalidateQueries(['user']);
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to update profile');
      },
    }
  );

  // Change password mutation
  const changePasswordMutation = useMutation(
    async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        toast.success('Password changed successfully!');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to change password');
      },
    }
  );

  // Login function
  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    await updateProfileMutation.mutateAsync(data);
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string) => {
    await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
