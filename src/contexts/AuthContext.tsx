import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { mockAuth, MockAuthUser } from '../services/mockAuth';

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

  const mapAuthUserToUser = (authUser: MockAuthUser): User => {
    const attributes = authUser.attributes || {};
    
    return {
      id: authUser.userId,
      username: authUser.username,
      email: authUser.signInDetails?.loginId || authUser.username,
      role: (attributes['custom:role'] as 'doctor' | 'staff') || 'staff',
      firstName: authUser.username.includes('doctor') ? 'Dr. John' : 'Jane',
      lastName: authUser.username.includes('doctor') ? 'Smith' : 'Doe',
      department: attributes['custom:department'],
      licenseNumber: attributes['custom:licenseNumber'],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
  };

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const authUser = await mockAuth.getCurrentUser();
        setUser(mapAuthUserToUser(authUser));
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
      await mockAuth.signIn({ username, password });
      // Re-check auth state after sign in
      const authUser = await mockAuth.getCurrentUser();
      setUser(mapAuthUserToUser(authUser));
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await mockAuth.signOut();
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
