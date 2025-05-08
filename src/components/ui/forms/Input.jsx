// src/components/ui/forms/Input.jsx
// Champ de saisie de texte 

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant Input qui affiche un champ de saisie texte personnalisé
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.id - ID unique pour le champ
 * @param {string} props.name - Nom du champ pour les formulaires
 * @param {string} props.type - Type de champ (text, email, password, etc.)
 * @param {string} props.value - Valeur actuelle du champ
 * @param {Function} props.onChange - Fonction appelée lors de la modification de la valeur
 * @param {Function} props.onBlur - Fonction appelée lorsque le champ perd le focus
 * @param {string} props.label - Texte d'étiquette pour le champ
 * @param {string} props.placeholder - Texte indicatif quand le champ est vide
 * @param {boolean} props.required - Si vrai, le champ est obligatoire
 * @param {boolean} props.disabled - Si vrai, le champ est désactivé
 * @param {string} props.error - Message d'erreur à afficher (optionnel)
 * @param {string} props.helpText - Texte d'aide pour le champ
 * @param {Object} props.icon - Icône à afficher dans le champ (optionnel)
 * @param {string} props.className - Classes CSS additionnelles
 * @param {string} props.ariaDescribedby - ID de l'élément qui décrit ce champ
 */
const Input = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  label,
  placeholder = '',
  required = false,
  disabled = false,
  error,
  helpText,
  icon,
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
      
      {/* Conteneur du champ (pour gérer l'icône) */}
      <div className="relative rounded-md shadow-sm">
        {/* Icône à gauche si présente */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        {/* Input */}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            block w-full rounded-md sm:text-sm
            ${icon ? 'pl-10' : 'pl-3'} 
            pr-3 py-2
            ${error
              ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            transition-colors
            focus:outline-none focus:ring-2
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
        />
        
        {/* Indicateur d'erreur */}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
  ariaDescribedby: PropTypes.string
};

export default Input;