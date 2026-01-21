import { a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Patient: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      dateOfBirth: a.string().required(),
      medicalRecordNumber: a.string().required(),
      department: a.string().required(),
      assignedDoctor: a.string(),
      lastVisit: a.string().required(),
      securityLevel: a.enum(['standard', 'sensitive']),
    })
    .authorization((allow) => [allow.authenticated()]),

  SecureOperation: a
    .model({
      name: a.string().required(),
      description: a.string().required(),
      category: a.enum(['prescription', 'diagnosis', 'procedure', 'records']),
      requiredRole: a.string().required(),
      requiresFaceLiveness: a.boolean().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  AuditLog: a
    .model({
      userId: a.string().required(),
      operation: a.string().required(),
      timestamp: a.datetime().required(),
      success: a.boolean().required(),
      faceLivenessVerified: a.boolean(),
      details: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
