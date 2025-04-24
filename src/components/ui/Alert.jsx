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
 */
const Alert = ({ 
  type = 'info', 
  message, 
  className = '' 
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

  return (
    <div 
      className={`
        px-4 py-3 rounded relative border 
        ${alertStyles[alertType]} 
        ${className}
      `} 
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

// PropTypes for type checking
Alert.propTypes = {
    type: PropTypes.oneOf(['succes', 'erreur', 'avertissement', 'info']),
  message: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Alert;