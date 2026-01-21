import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, signIn, signOut, AuthUser, fetchUserAttributes } from 'aws-amplify/auth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapAuthUserToUser = async (authUser: AuthUser): Promise<User> => {
    try {
      // Fetch user attributes separately
      const userAttributes = await fetchUserAttributes();
      console.log('Fetched User Attributes:', userAttributes);
      
      const role = userAttributes['custom:role'] as 'doctor' | 'staff' || 'staff';
      console.log('Detected role:', role);
      
      return {
        id: authUser.userId,
        username: authUser.username,
        email: userAttributes.email || authUser.username,
        role: role,
        firstName: userAttributes.given_name || (role === 'doctor' ? 'Dr. John' : 'Jane'),
        lastName: userAttributes.family_name || (role === 'doctor' ? 'Smith' : 'Doe'),
        department: userAttributes['custom:department'],
        licenseNumber: userAttributes['custom:licenseNumber'],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching user attributes:', error);
      return {
        id: authUser.userId,
        username: authUser.username,
        email: authUser.username,
        role: 'staff',
        firstName: 'Jane',
        lastName: 'Doe',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
    }
  };

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const authUser = await getCurrentUser();
        const mappedUser = await mapAuthUserToUser(authUser);
        setUser(mappedUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const handleSignIn = async (username: string, password: string) => {
    try {
      await signIn({ username, password });
      // Re-check auth state after sign in
      const authUser = await getCurrentUser();
      const mappedUser = await mapAuthUserToUser(authUser);
      setUser(mappedUser);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
