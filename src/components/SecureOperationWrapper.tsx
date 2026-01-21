import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/permissions';

interface SecureOperationWrapperProps {
  requiredRole: string;
  operation: string;
  children: ReactNode;
  onFaceLivenessRequired?: () => void;
}

const SecureOperationWrapper: React.FC<SecureOperationWrapperProps> = ({
  requiredRole,
  operation,
  children,
  onFaceLivenessRequired,
}) => {
  const { user } = useAuth();

  if (!hasPermission(user, requiredRole)) {
    return (
      <div className="access-denied">
        <p>Access denied. This operation requires {requiredRole} privileges.</p>
      </div>
    );
  }

  const handleClick = () => {
    if (requiredRole === 'doctor' && onFaceLivenessRequired) {
      onFaceLivenessRequired();
    }
  };

  return (
    <div onClick={handleClick} style={{ cursor: requiredRole === 'doctor' ? 'pointer' : 'default' }}>
      {children}
    </div>
  );
};

export default SecureOperationWrapper;
