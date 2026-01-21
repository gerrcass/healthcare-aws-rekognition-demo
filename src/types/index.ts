export interface User {
  id: string;
  username: string;
  email: string;
  role: 'doctor' | 'staff';
  firstName: string;
  lastName: string;
  department?: string;
  licenseNumber?: string;
  createdAt: string;
  lastLogin: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  medicalRecordNumber: string;
  department: string;
  assignedDoctor?: string;
  lastVisit: string;
  securityLevel: 'standard' | 'sensitive';
}

export interface SecureOperation {
  id: string;
  name: string;
  description: string;
  requiredRole: 'doctor';
  requiresFaceLiveness: boolean;
  category: 'prescription' | 'diagnosis' | 'procedure' | 'records';
}

export interface FaceLivenessSession {
  sessionId: string;
  userId: string;
  operationType: string;
  status: 'CREATED' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED';
  confidenceScore?: number;
  createdAt: string;
  completedAt?: string;
  expiresAt: string;
}
