import { Patient, SecureOperation } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    dateOfBirth: '1985-03-15',
    medicalRecordNumber: 'MRN001',
    department: 'Cardiology',
    assignedDoctor: 'Dr. Smith',
    lastVisit: '2024-01-15',
    securityLevel: 'standard',
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Wilson',
    dateOfBirth: '1978-07-22',
    medicalRecordNumber: 'MRN002',
    department: 'Neurology',
    assignedDoctor: 'Dr. Johnson',
    lastVisit: '2024-01-18',
    securityLevel: 'sensitive',
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'Davis',
    dateOfBirth: '1992-11-08',
    medicalRecordNumber: 'MRN003',
    department: 'Pediatrics',
    assignedDoctor: 'Dr. Brown',
    lastVisit: '2024-01-20',
    securityLevel: 'standard',
  },
];

export const mockSecureOperations: SecureOperation[] = [
  {
    id: '1',
    name: 'Prescribe Controlled Medication',
    description: 'Prescribe Schedule II controlled substances',
    requiredRole: 'doctor',
    requiresFaceLiveness: true,
    category: 'prescription',
  },
  {
    id: '2',
    name: 'Update Critical Diagnosis',
    description: 'Modify life-threatening diagnosis records',
    requiredRole: 'doctor',
    requiresFaceLiveness: true,
    category: 'diagnosis',
  },
  {
    id: '3',
    name: 'Authorize Surgery',
    description: 'Approve surgical procedures',
    requiredRole: 'doctor',
    requiresFaceLiveness: true,
    category: 'procedure',
  },
  {
    id: '4',
    name: 'Access Sensitive Records',
    description: 'View psychiatric or sensitive medical records',
    requiredRole: 'doctor',
    requiresFaceLiveness: true,
    category: 'records',
  },
];
