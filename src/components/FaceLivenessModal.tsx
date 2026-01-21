import React, { useState, useCallback, useRef, useEffect } from 'react';
import './FaceLivenessModal.css';

interface FaceLivenessModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onError: () => void;
  onClose: () => void;
  operationName: string;
}

const FaceLivenessModal: React.FC<FaceLivenessModalProps> = ({
  isOpen,
  onSuccess,
  onError,
  onClose,
  operationName,
}) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const createLivenessSession = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockSessionId = `session_${Date.now()}`;
      setSessionId(mockSessionId);
      setShowCamera(true);
    } catch (error) {
      console.error('Failed to create liveness session:', error);
      onError();
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 400 },
          height: { ideal: 300 },
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // Start verification process after camera is ready
      startVerificationProcess();
      
    } catch (error) {
      console.error('Camera access error:', error);
      onError();
    }
  }, []);

  const startVerificationProcess = useCallback(() => {
    const steps = [
      { delay: 1000, step: 1 },
      { delay: 2500, step: 2 },
      { delay: 4000, step: 3 },
      { delay: 5500, step: 4 }
    ];

    steps.forEach(({ delay, step }) => {
      setTimeout(() => {
        setVerificationStep(step);
        if (step === 4) {
          setTimeout(() => {
            // Stop camera before success
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }
            onSuccess();
          }, 500);
        }
      }, delay);
    });
  }, [onSuccess]);

  const handleStartVerification = useCallback(async () => {
    await createLivenessSession();
  }, [createLivenessSession]);

  // Start camera when session is created
  useEffect(() => {
    if (showCamera && sessionId) {
      startCamera();
    }
  }, [showCamera, sessionId, startCamera]);

  // Cleanup camera on unmount or close
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Facial Verification Required</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <div className="modal-body">
          <div className="operation-info">
            <p><strong>Operation:</strong> {operationName}</p>
            <p>Please complete facial verification to proceed with this secure operation.</p>
          </div>

          {!sessionId && !isLoading && (
            <div className="start-verification">
              <p>This will request access to your camera for facial verification.</p>
              <button onClick={handleStartVerification} className="start-button">
                Start Verification
              </button>
            </div>
          )}

          {isLoading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Initializing facial verification...</p>
            </div>
          )}

          {showCamera && sessionId && !isLoading && (
            <div className="liveness-container">
              <div className="camera-view">
                <div className="camera-frame">
                  <video
                    ref={videoRef}
                    className="camera-video"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="face-guide">
                    <div className="face-oval"></div>
                  </div>
                  <div className="camera-instructions">
                    <p>Position your face within the oval</p>
                    <p>Look directly at the camera</p>
                  </div>
                </div>
                
                <div className="verification-progress">
                  <div className={`step ${verificationStep >= 1 ? 'completed' : ''}`}>
                    {verificationStep >= 1 ? '✓' : '○'} Camera initialized
                  </div>
                  <div className={`step ${verificationStep >= 2 ? 'completed' : ''}`}>
                    {verificationStep >= 2 ? '✓' : '○'} Face detected
                  </div>
                  <div className={`step ${verificationStep >= 3 ? 'completed' : ''}`}>
                    {verificationStep >= 3 ? '✓' : '○'} Analyzing liveness
                  </div>
                  <div className={`step ${verificationStep >= 4 ? 'completed' : ''}`}>
                    {verificationStep >= 4 ? '✓' : '○'} Verification complete
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceLivenessModal;
