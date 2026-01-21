import { Amplify } from 'aws-amplify';

// Mock configuration for demo
const mockOutputs = {
  auth: {
    user_pool_id: "us-east-1_XXXXXXXXX",
    aws_region: "us-east-1",
    user_pool_client_id: "XXXXXXXXXXXXXXXXXXXXXXXXXX",
    identity_pool_id: "us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    mfa_methods: [],
    standard_required_attributes: ["email"],
    username_attributes: ["email"],
    user_verification_types: ["email"],
    mfa_configuration: "OFF",
    password_policy: {
      min_length: 8,
      require_numbers: true,
      require_lowercase: true,
      require_uppercase: true,
      require_symbols: true
    }
  },
  data: {
    url: "https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql",
    aws_region: "us-east-1",
    default_authorization_type: "AMAZON_COGNITO_USER_POOLS",
    authorization_types: ["AMAZON_COGNITO_USER_POOLS"]
  },
  version: "1"
};

Amplify.configure(mockOutputs);

export default Amplify;
