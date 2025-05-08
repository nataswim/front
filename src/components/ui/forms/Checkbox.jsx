// Cases à cocher (checkboxes) pour les formulaires
// Personnalisation visuelle des cases à cocher
// Les cases à cocher sont des éléments d'interface utilisateur qui permettent aux utilisateurs de sélectionner une ou plusieurs options dans une liste.
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant Checkbox qui affiche une case à cocher personnalisée
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.id - ID unique pour le champ
 * @param {string} props.name - Nom du champ pour les formulaires
 * @param {boolean} props.checked - État coché/décoché de la case
 * @param {Function} props.onChange - Fonction appelée lors du changement d'état
 * @param {string} props.label - Texte d'étiquette associé à la case à cocher
 * @param {boolean} props.disabled - Si vrai, désactive la case à cocher
 * @param {string} props.error - Message d'erreur à afficher (optionnel)
 * @param {string} props.className - Classes CSS additionnelles
 */
const Checkbox = ({
  id,
  name,
  checked = false,
  onChange,
  label,
  disabled = false,
  error,
  className = '',
}) => {
  // Générer un ID unique pour les messages d'erreur
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            h-4 w-4 rounded 
            ${error ? 'border-red-500' : 'border-gray-300'} 
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-colors
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
        />
      </div>
      
      {label && (
        <div className="ml-3 text-sm">
          <label 
            htmlFor={id} 
            className={`
              font-medium 
              ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer'}
            `}
          >
            {label}
          </label>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
};

// PropTypes pour la vérification des types
Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

export default Checkbox;