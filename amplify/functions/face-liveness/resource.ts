import { defineFunction } from '@aws-amplify/backend';

export const faceLivenessFunction = defineFunction({
  name: 'face-liveness',
  entry: './handler.ts',
});
