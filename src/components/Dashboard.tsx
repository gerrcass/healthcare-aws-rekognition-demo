import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockPatients, mockSecureOperations } from '../data/mockData';
import { canAccessSecureOperations } from '../utils/permissions';
import SecureOperationWrapper from './SecureOperationWrapper';
import FaceLivenessModal from './FaceLivenessModal';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [showFaceLiveness, setShowFaceLiveness] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [operationResult, setOperationResult] = useState<any>(null);

  const handleSecureOperation = (operationName: string) => {
    setSelectedOperation(operationName);
    setShowFaceLiveness(true);
  };

  const handleFaceLivenessSuccess = () => {
    setShowFaceLiveness(false);
    
    // Generate mock operation result
    const result = {
      operation: selectedOperation,
      timestamp: new Date().toISOString(),
      user: `${user?.firstName} ${user?.lastName}`,
      userId: user?.id,
      licenseNumber: user?.licenseNumber,
      faceLivenessSession: `session_${Date.now()}`,
      confidenceScore: 96.7,
      verificationStatus: 'SUCCEEDED',
      auditTrail: {
        authenticationTime: new Date(Date.now() - 300000).toISOString(),
        facialVerificationTime: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: 'Healthcare EHR Demo',
      },
      operationDetails: getOperationDetails(selectedOperation)
    };
    
    setOperationResult(result);
    setSelectedOperation('');
  };

  const getOperationDetails = (operationName: string) => {
    const details: Record<string, any> = {
      'Prescribe Controlled Medication': {
        category: 'Prescription',
        riskLevel: 'High',
        regulatoryCompliance: ['DEA Schedule II', 'HIPAA'],
        requiredDocumentation: ['Patient consent', 'Medical justification', 'Dosage verification']
      },
      'Update Critical Diagnosis': {
        category: 'Medical Records',
        riskLevel: 'Critical',
        regulatoryCompliance: ['HIPAA', 'Medical Board Standards'],
        requiredDocumentation: ['Clinical evidence', 'Peer review', 'Patient notification']
      },
      'Authorize Surgery': {
        category: 'Procedure Authorization',
        riskLevel: 'Critical',
        regulatoryCompliance: ['Joint Commission', 'HIPAA', 'State Medical Board'],
        requiredDocumentation: ['Surgical consent', 'Pre-op clearance', 'Risk assessment']
      },
      'Access Sensitive Records': {
        category: 'Data Access',
        riskLevel: 'High',
        regulatoryCompliance: ['HIPAA', 'Privacy Act'],
        requiredDocumentation: ['Access justification', 'Patient consent', 'Audit trail']
      }
    };
    
    return details[operationName] || {
      category: 'General',
      riskLevel: 'Standard',
      regulatoryCompliance: ['HIPAA'],
      requiredDocumentation: ['Standard authorization']
    };
  };

  const handleFaceLivenessError = () => {
    setShowFaceLiveness(false);
    alert('Facial verification failed. Operation cancelled.');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Healthcare EHR Dashboard</h1>
          <div className="user-info">
            <span className={`role-badge ${user?.role}`}>
              {user?.role?.toUpperCase()}
            </span>
            <span>{user?.firstName} {user?.lastName}</span>
            <button onClick={signOut} className="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          {/* Patient List */}
          <section className="dashboard-section">
            <h2>Patient List</h2>
            <div className="patient-list">
              {mockPatients.map((patient) => (
                <div key={patient.id} className="patient-card">
                  <div className="patient-header">
                    <h3>{patient.firstName} {patient.lastName}</h3>
                    <span className={`security-level ${patient.securityLevel}`}>
                      {patient.securityLevel}
                    </span>
                  </div>
                  <div className="patient-details">
                    <p><strong>MRN:</strong> {patient.medicalRecordNumber}</p>
                    <p><strong>Department:</strong> {patient.department}</p>
                    <p><strong>Last Visit:</strong> {patient.lastVisit}</p>
                    {patient.assignedDoctor && (
                      <p><strong>Doctor:</strong> {patient.assignedDoctor}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Secure Operations */}
          {canAccessSecureOperations(user) && (
            <section className="dashboard-section">
              <h2>Secure Operations</h2>
              <p className="section-description">
                These operations require facial verification for additional security.
              </p>
              <div className="operations-grid">
                {mockSecureOperations.map((operation) => (
                  <SecureOperationWrapper
                    key={operation.id}
                    requiredRole={operation.requiredRole}
                    operation={operation.name}
                    onFaceLivenessRequired={() => handleSecureOperation(operation.name)}
                  >
                    <div className="operation-card secure">
                      <div className="operation-header">
                        <h3>{operation.name}</h3>
                        <span className="verification-badge">
                          🔒 Facial Verification Required
                        </span>
                      </div>
                      <p>{operation.description}</p>
                      <div className="operation-meta">
                        <span className="category">{operation.category}</span>
                      </div>
                    </div>
                  </SecureOperationWrapper>
                ))}
              </div>
            </section>
          )}

          {/* Standard Operations */}
          <section className="dashboard-section">
            <h2>Standard Operations</h2>
            <div className="operations-grid">
              <div className="operation-card">
                <h3>View Patient Records</h3>
                <p>Access standard patient information and medical history</p>
                <button className="operation-btn">Access Records</button>
              </div>
              <div className="operation-card">
                <h3>Schedule Appointments</h3>
                <p>Manage patient appointments and scheduling</p>
                <button className="operation-btn">Manage Schedule</button>
              </div>
              <div className="operation-card">
                <h3>Update Patient Info</h3>
                <p>Modify basic patient demographic information</p>
                <button className="operation-btn">Update Info</button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showFaceLiveness && (
        <FaceLivenessModal
          isOpen={showFaceLiveness}
          onSuccess={handleFaceLivenessSuccess}
          onError={handleFaceLivenessError}
          onClose={() => setShowFaceLiveness(false)}
          operationName={selectedOperation}
        />
      )}

      {operationResult && (
        <div className="operation-result-modal">
          <div className="result-content">
            <div className="result-header">
              <h2>✅ Operation Completed Successfully</h2>
              <button onClick={() => setOperationResult(null)} className="close-button">×</button>
            </div>
            
            <div className="result-body">
              <div className="result-summary">
                <h3>{operationResult.operation}</h3>
                <p className="success-message">Completed with facial verification at {new Date(operationResult.timestamp).toLocaleString()}</p>
              </div>
              
              <div className="result-details">
                <div className="detail-section">
                  <h4>Verification Details</h4>
                  <div className="detail-grid">
                    <div><strong>Confidence Score:</strong> {operationResult.confidenceScore}%</div>
                    <div><strong>Status:</strong> {operationResult.verificationStatus}</div>
                    <div><strong>Session ID:</strong> {operationResult.faceLivenessSession}</div>
                    <div><strong>Authorized By:</strong> {operationResult.user} (License: {operationResult.licenseNumber})</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Operation Information</h4>
                  <div className="detail-grid">
                    <div><strong>Category:</strong> {operationResult.operationDetails.category}</div>
                    <div><strong>Risk Level:</strong> <span className={`risk-${operationResult.operationDetails.riskLevel.toLowerCase()}`}>{operationResult.operationDetails.riskLevel}</span></div>
                    <div><strong>Compliance:</strong> {operationResult.operationDetails.regulatoryCompliance.join(', ')}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Audit Trail</h4>
                  <div className="detail-grid">
                    <div><strong>Authentication:</strong> {new Date(operationResult.auditTrail.authenticationTime).toLocaleString()}</div>
                    <div><strong>Facial Verification:</strong> {new Date(operationResult.auditTrail.facialVerificationTime).toLocaleString()}</div>
                    <div><strong>IP Address:</strong> {operationResult.auditTrail.ipAddress}</div>
                    <div><strong>User Agent:</strong> {operationResult.auditTrail.userAgent}</div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Required Documentation</h4>
                  <ul>
                    {operationResult.operationDetails.requiredDocumentation.map((doc: string, index: number) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="result-actions">
                <button onClick={() => setOperationResult(null)} className="close-result-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
