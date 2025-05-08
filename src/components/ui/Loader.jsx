// Indicateur de chargement specifique à l'application 
// Ce composant est utilisé pour indiquer à l'utilisateur que l'application est en cours de chargement
// Ce composant est utilisé dans le composant App.jsx
// Ce composant est utilisé dans le composant Home.jsx
// exemple de code {/* Loader par défaut */} <Loader /> {/* Spinner bleu de grande taille */} <Loader type="spinner" size="lg" />

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Versatile Loader component for the application
 * @param {Object} props - Component properties
 * @param {string} [props.type='default'] - Loader type (default, spinner, dots, bar)
 * @param {string} [props.size='md'] - Loader size (sm, md, lg)
 * @param {string} [props.color='blue'] - Loader color (blue, green, red, gray)
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.label] - Optional loading text
 * @param {string} [props.ariaLabel] - Accessible label for screen readers
 */
const Loader = ({
  type = 'default',
  size = 'md',
  color = 'blue',
  className = '',
  label,
  ariaLabel
}) => {
  // Validate and set loader type
  const loaderTypes = {
    default: 'animate-pulse',
    spinner: 'animate-spin',
    dots: 'loader-dots',
    bar: 'loader-bar'
  };
  const validType = Object.keys(loaderTypes).includes(type) ? type : 'default';

  // Validate and set loader size
  const loaderSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  const validSize = Object.keys(loaderSizes).includes(size) ? size : 'md';

  // Validate and set loader color
  const loaderColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    gray: 'text-gray-500'
  };
  const validColor = Object.keys(loaderColors).includes(color) ? color : 'blue';

  // Accessible label
  const accessibleLabel = ariaLabel || label || 'Chargement en cours';

  // Render specific loader type
  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <svg 
            className={`
              ${loaderSizes[validSize]} 
              ${loaderColors[validColor]} 
              ${loaderTypes[validType]}
              ${className}
            `}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
      
      case 'dots':
        return (
          <div 
            className={`
              flex space-x-1 
              ${loaderColors[validColor]} 
              ${className}
            `}
            aria-hidden="true"
          >
            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200"></div>
          </div>
        );
      
      case 'bar':
        return (
          <div 
            className={`
              w-full h-1 
              ${loaderColors[validColor]} 
              ${loaderTypes[validType]}
              ${className}
            `}
            aria-hidden="true"
          >
            <div className="h-full bg-current animate-progress"></div>
          </div>
        );
      
      default:
        return (
          <div 
            className={`
              ${loaderSizes[validSize]} 
              ${loaderColors[validColor]} 
              ${loaderTypes[validType]}
              bg-current rounded-full
              ${className}
            `}
            aria-hidden="true"
          ></div>
        );
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {renderLoader()}
      {label && (
        <p className={`mt-2 text-sm ${loaderColors[validColor]}`}>
          {label}
        </p>
      )}
      <span className="sr-only">{accessibleLabel}</span>
    </div>
  );
};

// PropTypes for type checking
Loader.propTypes = {
  type: PropTypes.oneOf(['default', 'spinner', 'dots', 'bar']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['blue', 'green', 'red', 'gray']),
  className: PropTypes.string,
  label: PropTypes.string,
  ariaLabel: PropTypes.string
};

export default Loader;