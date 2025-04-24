// Composant pour afficher des cartes d'informations
// {/* Carte par défaut simple */} <Carte><p>Contenu de la carte</p> </Carte> 
// {/* Carte avec titre */} <Carte titre="Informations Utilisateur">  <div>Détails de l'utilisateur</div> </Carte>


import React from 'react';
import PropTypes from 'prop-types';

/**
 * Versatile Card component for the application
 * @param {Object} props - Component properties
 * @param {string} [props.title] - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.type='default'] - Card type (default, elevated, bordered)
 * @param {React.ReactNode} [props.footer] - Footer content
 */
const Card = ({
  title,
  children,
  className = '',
  type = 'default',
  footer
}) => {
  // Define card type styles
  const typeStyles = {
    default: 'bg-white shadow-sm',
    elevated: 'bg-white shadow-md',
    bordered: 'bg-white border border-gray-200 shadow-sm'
  };

  // Validate card type
  const validType = Object.keys(typeStyles).includes(type) ? type : 'default';

  return (
    <div 
      className={`
        rounded-lg 
        ${typeStyles[validType]}
        ${className}
      `}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-800">
          {title}
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking
Card.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['default', 'elevated', 'bordered']),
  footer: PropTypes.node
};

export default Card;