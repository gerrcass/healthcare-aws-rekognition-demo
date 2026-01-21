import { RekognitionClient, CreateFaceLivenessSessionCommand, GetFaceLivenessSessionResultsCommand } from '@aws-sdk/client-rekognition';

const rekognition = new RekognitionClient({ region: process.env.AWS_REGION });

export const handler = async (event: any) => {
  const { action, sessionId } = event;

  try {
    switch (action) {
      case 'createSession':
        const createCommand = new CreateFaceLivenessSessionCommand({});
        const createResult = await rekognition.send(createCommand);
        return {
          statusCode: 200,
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
          body: JSON.stringify({
            confidence: getResult.Confidence,
            status: getResult.Status,
            auditImages: getResult.AuditImages,
          }),
        };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' }),
        };
    }
  } catch (error) {
    console.error('FaceLiveness error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
