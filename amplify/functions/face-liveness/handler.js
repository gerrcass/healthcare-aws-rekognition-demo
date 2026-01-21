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
    
    const rekognition = new RekognitionClient({ region: process.env.AWS_REGION || 'us-east-2' });

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
    console.error('FaceLiveness error:', error);
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
