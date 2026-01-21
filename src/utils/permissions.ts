import { User } from '../types';

export const isDoctor = (user: User | null): boolean => {
  return user?.role === 'doctor';
};

export const isStaff = (user: User | null): boolean => {
  return user?.role === 'staff';
};

export const canAccessSecureOperations = (user: User | null): boolean => {
  return isDoctor(user);
};

export const hasPermission = (user: User | null, requiredRole: string): boolean => {
  if (!user) return false;
  return user.role === requiredRole;
};
