// Composant pour afficher des cartes d'informations
// {/* Carte par défaut simple */} <Carte><p>Contenu de la carte</p> </Carte> 
// {/* Carte avec titre */} <Carte titre="Informations Utilisateur">  <div>Détails de l'utilisateur</div> </Carte>

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Versatile Card component for the application
 * @param {Object} props - Component properties
 * @param {string|React.ReactNode} [props.title] - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.type='default'] - Card type (default, elevated, bordered)
 * @param {React.ReactNode} [props.footer] - Footer content
 * @param {string} [props.ariaLabel] - Accessible label for the card
 * @param {string} [props.ariaDescribedby] - ID of element that describes the card
 */
const Card = ({
  title,
  children,
  className = '',
  type = 'default',
  footer,
  ariaLabel,
  ariaDescribedby
}) => {
  // Define card type styles
  const typeStyles = {
    default: 'bg-white shadow-sm',
    elevated: 'bg-white shadow-md',
    bordered: 'bg-white border border-gray-200 shadow-sm'
  };

  // Validate card type
  const validType = Object.keys(typeStyles).includes(type) ? type : 'default';

  // Generate unique IDs for accessibility
  const titleId = title ? `card-title-${Math.random().toString(36).substring(2, 9)}` : undefined;

  return (
    <div 
      className={`
        rounded-lg 
        ${typeStyles[validType]}
        ${className}
      `}
      role="region"
      aria-labelledby={titleId}
      aria-label={!title && ariaLabel ? ariaLabel : undefined}
      aria-describedby={ariaDescribedby}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-800">
          {typeof title === 'string' ? (
            <h3 id={titleId} className="m-0 p-0">{title}</h3>
          ) : (
            <div id={titleId}>{title}</div>
          )}
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
  footer: PropTypes.node,
  ariaLabel: PropTypes.string,
  ariaDescribedby: PropTypes.string
};

export default Card;