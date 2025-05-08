import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant de chargement accessible
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} [props.message='Chargement des données...'] - Message de chargement
 * @param {string} [props.size='medium'] - Taille du spinner (small, medium, large)
 * @param {string} [props.color='primary'] - Couleur du spinner
 * @returns {React.ReactElement} Composant de chargement
 */
const LoadingComponent = ({ 
  message = 'Chargement des données...',
  size = 'medium',
  color = 'primary'
}) => {
  // Déterminer la taille du spinner
  const spinnerSize = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg'
  }[size] || '';

  // Déterminer la classe de couleur
  const colorClass = `text-${color}`;

  return (
    <div 
      className="text-center py-5"
      role="status"
      aria-live="polite"
    >
      <div className={`spinner-border ${spinnerSize} ${colorClass}`} aria-hidden="true">
        <span className="visually-hidden">Chargement...</span>
      </div>
      <p className="mt-3">{message}</p>
    </div>
  );
};

// PropTypes pour la vérification des types
LoadingComponent.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string
};

export default LoadingComponent;