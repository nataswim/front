//  src/components/ui/forms/Select.jsx
// Menu déroulant (select) pour choisir une option parmi plusieurs (ex: liste d'exercices )

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant Select qui affiche un menu déroulant personnalisé
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.id - ID unique pour le champ
 * @param {string} props.name - Nom du champ pour les formulaires
 * @param {string} props.value - Valeur sélectionnée
 * @param {Function} props.onChange - Fonction appelée lors de la sélection d'une option
 * @param {Function} props.onBlur - Fonction appelée lorsque le champ perd le focus
 * @param {string} props.label - Texte d'étiquette pour le champ
 * @param {boolean} props.required - Si vrai, le champ est obligatoire
 * @param {boolean} props.disabled - Si vrai, le champ est désactivé
 * @param {string} props.error - Message d'erreur à afficher (optionnel)
 * @param {string} props.helpText - Texte d'aide pour le champ
 * @param {React.ReactNode} props.children - Options du menu (éléments <option>)
 * @param {string} props.className - Classes CSS additionnelles
 * @param {string} props.ariaDescribedby - ID de l'élément qui décrit ce champ
 */
const Select = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  label,
  required = false,
  disabled = false,
  error,
  helpText,
  children,
  className = '',
  ariaDescribedby
}) => {
  // Générer des IDs uniques pour les éléments d'accessibilité
  const errorId = error ? `${id}-error` : undefined;
  const helpTextId = helpText ? `${id}-description` : undefined;
  const describedBy = [ariaDescribedby, errorId, helpTextId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          {required && <span className="sr-only">(obligatoire)</span>}
        </label>
      )}
      
      {/* Conteneur du select avec icône personnalisée */}
      <div className="relative rounded-md shadow-sm">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          className={`
            block w-full rounded-md sm:text-sm appearance-none
            pl-3 pr-10 py-2
            ${error
              ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            transition-colors
            focus:outline-none focus:ring-2
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
        >
          {children}
        </select>
        
        {/* Flèche personnalisée */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className={`h-5 w-5 ${error ? 'text-red-500' : 'text-gray-400'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        
        {/* Indicateur d'erreur */}
        {error && (
          <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      
      {/* Message d'erreur */}
      {error && (
        <p className="mt-1 text-sm text-red-600" id={errorId}>
          {error}
        </p>
      )}
      
      {/* Texte d'aide */}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500" id={helpTextId}>
          {helpText}
        </p>
      )}
    </div>
  );
};

// PropTypes pour la vérification des types
Select.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  ariaDescribedby: PropTypes.string
};

export default Select;