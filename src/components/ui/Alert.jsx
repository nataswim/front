// Messages d'alerte succès, erreur, info, etc. 
// <Alerte type="succes" message="Opération terminée avec succès !" />
// <Alerte type="erreur" message="Une erreur s'est produite." />
// <Alerte type="avertissement" message="Avertissement : Une action est requise." />
// <Alerte message="Message d'information par défaut" />

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Alert component for displaying various types of messages
 * @param {Object} props - Component properties
 * @param {string} props.type - Type of alert (success, error, warning, info)
 * @param {string} props.message - Message to be displayed
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.dismissible] - Whether the alert can be dismissed
 * @param {function} [props.onDismiss] - Function to call when alert is dismissed
 */
const Alert = ({ 
  type = 'info', 
  message, 
  className = '',
  dismissible = false,
  onDismiss
}) => {
  // Define alert type styles
  const alertStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  // Validate alert type
  const alertType = Object.keys(alertStyles).includes(type) ? type : 'info';

  // Map alert types to ARIA roles
  const alertRoles = {
    success: 'status',
    error: 'alert',
    warning: 'alert',
    info: 'status'
  };

  return (
    <div 
      className={`
        px-4 py-3 rounded relative border 
        ${alertStyles[alertType]} 
        ${className}
      `} 
      role={alertRoles[alertType]}
      aria-live={alertType === 'error' || alertType === 'warning' ? 'assertive' : 'polite'}
    >
      <span className="block sm:inline">{message}</span>
      {dismissible && (
        <button
          type="button"
          className="absolute top-0 right-0 p-2"
          onClick={onDismiss}
          aria-label="Fermer"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
};

// PropTypes for type checking
Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func
};

export default Alert;