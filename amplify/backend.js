import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { faceLivenessFunction } from './functions/face-liveness/resource.js';

export const backend = defineBackend({
  auth,
  data,
  faceLivenessFunction,
});

// Add Rekognition permissions to the function
backend.faceLivenessFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'rekognition:CreateFaceLivenessSession',
      'rekognition:GetFaceLivenessSessionResults'
    ],
    resources: ['*']
  })
);

// Create function URL for direct access
const functionUrl = backend.faceLivenessFunction.resources.lambda.addFunctionUrl({
  authType: 'NONE',
  cors: {
    allowCredentials: false,
    allowedHeaders: ['*'],
    allowedMethods: ['POST'],
    allowedOrigins: ['*'],
  },
});

backend.addOutput({
  custom: {
    faceLivenessApiUrl: functionUrl.url,
  },
});
