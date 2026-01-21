// Mock authentication service for demo purposes
// In a real implementation, this would use AWS Amplify Auth

export interface MockAuthUser {
  userId: string;
  username: string;
  signInDetails?: {
    loginId: string;
  };
  attributes?: {
    'custom:role'?: string;
    'custom:department'?: string;
    'custom:licenseNumber'?: string;
  };
}

const mockUsers: Record<string, { password: string; user: MockAuthUser }> = {
  'doctor@example.com': {
    password: 'password123',
    user: {
      userId: 'doctor-1',
      username: 'doctor@example.com',
      signInDetails: { loginId: 'doctor@example.com' },
      attributes: {
        'custom:role': 'doctor',
        'custom:department': 'Cardiology',
        'custom:licenseNumber': 'MD123456',
      },
    },
  },
  'staff@example.com': {
    password: 'password123',
    user: {
      userId: 'staff-1',
      username: 'staff@example.com',
      signInDetails: { loginId: 'staff@example.com' },
      attributes: {
        'custom:role': 'staff',
        'custom:department': 'Administration',
      },
    },
  },
};

let currentUser: MockAuthUser | null = null;

export const mockAuth = {
  signIn: async ({ username, password }: { username: string; password: string }) => {
    const userRecord = mockUsers[username];
    if (!userRecord || userRecord.password !== password) {
      throw new Error('Invalid credentials');
    }
    currentUser = userRecord.user;
    return { isSignedIn: true };
  },

  signOut: async () => {
    currentUser = null;
  },

  getCurrentUser: async () => {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    return currentUser;
  },
};

// Override Amplify Auth functions for demo
if (typeof window !== 'undefined') {
  (window as any).mockAuth = mockAuth;
}
