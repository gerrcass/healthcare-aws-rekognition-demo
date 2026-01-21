# Healthcare FaceLiveness Demo Application

A React-based healthcare Electronic Health Records (EHR) demo application showcasing Amazon Rekognition FaceLiveness technology with role-based access control.

## Features

- **Two-tier Authentication System**
  - Standard AWS Cognito authentication for all users
  - Additional facial verification for doctor users accessing secure operations

- **Role-based Access Control**
  - **Staff Users**: Standard dashboard access without facial verification
  - **Doctor Users**: Enhanced access including secure operations requiring facial verification

- **Healthcare-focused Interface**
  - Patient information management
  - Secure operations for sensitive medical procedures
  - Audit logging for compliance
  - Healthcare-appropriate styling and UX

## Demo Credentials

- **Doctor**: `doctor@example.com` / `password123`
- **Staff**: `staff@example.com` / `password123`

## Architecture

- **Frontend**: React with TypeScript
- **Authentication**: AWS Cognito (mocked for demo)
- **Facial Verification**: Amazon Rekognition FaceLiveness (mocked for demo)
- **Backend**: AWS Amplify with Lambda functions
- **Database**: AWS AppSync with DynamoDB

## Getting Started

### Prerequisites

- Node.js 18+ (Note: Some AWS SDK packages require Node 20+, but the demo works with 18)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd healthcare-faceliveness-demo
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### For Staff Users
1. Log in with staff credentials
2. Access standard healthcare operations:
   - View patient records
   - Schedule appointments
   - Update patient information

### For Doctor Users
1. Log in with doctor credentials
2. Access all standard operations plus secure operations:
   - Prescribe controlled medications
   - Update critical diagnoses
   - Authorize surgical procedures
   - Access sensitive medical records

3. When attempting secure operations:
   - Facial verification modal will appear
   - Click "Start Verification" to begin the process
   - **Allow camera access** when prompted by your browser
   - Position your face within the oval guide
   - The system will automatically complete verification steps
   - Operation will be authorized upon successful verification

## Testing

The application includes both unit tests and property-based tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run property-based tests specifically
npm test -- --testNamePattern="Property"
```

### Property-Based Testing

The application uses `fast-check` for property-based testing to validate correctness properties:

- **Property 5**: Staff users have standard access without facial verification
- **Property 6**: Doctor users have enhanced access including secure operations
- **Property 7**: Staff users are blocked from secure operations
- **Property 8**: Role-based operation validation works correctly

## Security Features

- **Session Management**: Automatic session timeout and renewal
- **Audit Logging**: All security events are logged for compliance
- **Access Control**: Fine-grained permissions based on user roles
- **Facial Verification**: Additional security layer for sensitive operations
- **Data Encryption**: All communications use HTTPS

## Compliance

The application is designed with healthcare compliance in mind:

- HIPAA-compliant error messages
- Audit trails for sensitive operations
- Role-based access to patient data
- Secure session management

## Development

### Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts (Auth)
├── data/              # Mock data
├── services/          # API services
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── __tests__/         # Test files
```

### Key Components

- **AuthProvider**: Manages authentication state and user sessions
- **Dashboard**: Main application interface with role-based features
- **FaceLivenessModal**: Handles facial verification workflow
- **SecureOperationWrapper**: Enforces access control for sensitive operations

### Mock Services

For demo purposes, the application uses mock services:

- **mockAuth.ts**: Simulates AWS Cognito authentication
- **FaceLivenessModal**: Simulates Amazon Rekognition FaceLiveness

## Deployment

### AWS Amplify Deployment

1. Initialize Amplify backend:
   ```bash
   npx ampx sandbox
   ```

2. Deploy to AWS:
   ```bash
   npx ampx pipeline-deploy --branch main
   ```

### Environment Variables

Configure the following environment variables for production:

- `REACT_APP_AWS_REGION`: AWS region for services
- `REACT_APP_USER_POOL_ID`: Cognito User Pool ID
- `REACT_APP_USER_POOL_CLIENT_ID`: Cognito User Pool Client ID

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please contact the development team or create an issue in the repository.
