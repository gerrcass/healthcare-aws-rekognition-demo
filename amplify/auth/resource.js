import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    'custom:role': {
      dataType: 'String',
      mutable: true,
    },
    'custom:department': {
      dataType: 'String',
      mutable: true,
    },
    'custom:licenseNumber': {
      dataType: 'String',
      mutable: true,
    },
  },
});
