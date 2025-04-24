// src/components/ui/Button.jsx
// Bouton réutilisable avec des variantes de couleur et de taille


import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant Bouton personnalisable pour l'application
 * @param {Object} props - Propriétés du composant
 * @param {string} [props.type='primary'] - Type de bouton (primary, secondary, success, danger, warning)
 * @param {string} [props.taille='md'] - Taille du bouton (sm, md, lg)
 * @param {boolean} [props.desactive=false] - État désactivé du bouton
 * @param {string} [props.className] - Classes CSS supplémentaires
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {Function} [props.onClick] - Gestionnaire d'événement de clic
 */
const Button = ({
  type = 'primary',
  taille = 'md',
  desactive = false,
  className = '',
  children,
  onClick
}) => {
  // Définir les styles de base pour les types de boutons
  const stylesType = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300'
  };

  // Définir les tailles de bouton
  const stylesTaille = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Valider le type et la taille
  const typeValide = Object.keys(stylesType).includes(type) ? type : 'primary';
  const tailleValide = Object.keys(stylesTaille).includes(taille) ? taille : 'md';

  return (
    <button
      className={`
        rounded-md 
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${stylesType[typeValide]}
        ${stylesTaille[tailleValide]}
        ${className}
      `}
      disabled={desactive}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

// PropTypes pour la vérification des types
Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning']),
  taille: PropTypes.oneOf(['sm', 'md', 'lg']),
  desactive: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func
};

export default Button;