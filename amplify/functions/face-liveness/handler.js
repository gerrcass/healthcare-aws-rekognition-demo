export const handler = async (event) => {
  // Handle both direct invocation and HTTP requests
  const body = event.body ? JSON.parse(event.body) : event;
  const { action, sessionId } = body;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Import AWS SDK dynamically
    const { RekognitionClient, CreateFaceLivenessSessionCommand, GetFaceLivenessSessionResultsCommand } = await import('@aws-sdk/client-rekognition');
    
    // Use explicit Rekognition region. In some orgs Control Tower SCPs block Rekognition
    // operations outside the primary region. Allow overriding via REKOGNITION_REGION env var.
    const rekognitionRegion = process.env.REKOGNITION_REGION || process.env.AWS_REGION || 'us-east-1';
    console.log('Using Rekognition region:', rekognitionRegion);
    const rekognition = new RekognitionClient({ region: rekognitionRegion });

    switch (action) {
      case 'createSession':
        const createCommand = new CreateFaceLivenessSessionCommand({});
        const createResult = await rekognition.send(createCommand);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            sessionId: createResult.SessionId,
          }),
        };

      case 'getResults':
        const getCommand = new GetFaceLivenessSessionResultsCommand({
          SessionId: sessionId,
        });
        const getResult = await rekognition.send(getCommand);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            confidence: getResult.Confidence,
            status: getResult.Status,
            auditImages: getResult.AuditImages || [],
          }),
        };

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' }),
        };
    }
  } catch (error) {
    console.error('FaceLiveness error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      metadata: error.$metadata || null,
    });
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
    };
  }
};
