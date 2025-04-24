// src/hooks/useForm.js
// Gestion des formulaires  avec React Hooks personnalisés (useForm)


import { useState, useCallback, useEffect } from 'react';

// Fonction de validation par défaut
const defaultValidate = () => ({});

/**
 * Hook personnalisé pour la gestion de formulaires
 * @param {Object} initialValues - Valeurs initiales du formulaire
 * @param {Function} onSubmit - Fonction de soumission du formulaire
 * @param {Object} config - Configuration optionnelle du formulaire
 */
export const useForm = (
  initialValues = {}, 
  onSubmit = () => {}, 
  config = {}
) => {
  const {
    validate = defaultValidate,
    initialErrors = {},
    resetOnSubmit = true
  } = config;

  // États du formulaire
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validation des valeurs
  useEffect(() => {
    // Exécuter la validation
    const validationErrors = validate(values);
    setErrors(validationErrors);

    // Vérifier la validité globale du formulaire
    setIsValid(Object.keys(validationErrors).length === 0);
  }, [values, validate]);

  // Gérer les changements de champ
  const handleChange = useCallback((event) => {
    const { name, value, type, checked, files } = event.target;
    
    // Gestion des différents types d'inputs
    const inputValue = type === 'checkbox' 
      ? checked 
      : type === 'file' 
        ? files 
        : value;

    setValues(prev => ({
      ...prev,
      [name]: inputValue
    }));
  }, []);

  // Gérer le changement manuel de valeur
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Gérer le blur (perte de focus)
  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  // Réinitialiser le formulaire
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors(initialErrors);
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues, initialErrors]);

  // Soumettre le formulaire
  const handleSubmit = useCallback(async (event) => {
    // Empêcher le comportement par défaut du formulaire
    if (event) {
      event.preventDefault();
    }

    // Marquer tous les champs comme touchés
    const touchedFields = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(touchedFields);

    // Valider avant la soumission
    const validationErrors = validate(values);
    setErrors(validationErrors);

    // Vérifier s'il y a des erreurs
    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsSubmitting(true);
        await onSubmit(values);

        // Réinitialiser si configuré
        if (resetOnSubmit) {
          resetForm();
        }
      } catch (submitError) {
        // Gestion des erreurs de soumission
        console.error('Form submission error:', submitError);
        setErrors(prev => ({
          ...prev,
          submit: submitError.message || 'Erreur de soumission'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit, resetOnSubmit, resetForm]);

  // Retourner les méthodes et états du formulaire
  return {
    // États
    values,        // Valeurs actuelles du formulaire
    errors,        // Erreurs de validation
    touched,       // Champs ayant perdu le focus
    isSubmitting,  // En cours de soumission
    isValid,       // Validité globale du formulaire

    // Méthodes
    handleChange,  // Gestion des changements de champ
    handleBlur,    // Gestion de la perte de focus
    handleSubmit,  // Soumission du formulaire
    resetForm,     // Réinitialisation du formulaire
    setValue,      // Définition manuelle de valeur
    setValues,     // Définition de plusieurs valeurs
    setErrors      // Définition manuelle des erreurs
  };
};

// Fonctions utilitaires de validation
export const formValidators = {
  // Validation de l'email
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) 
      ? null 
      : 'Veuillez entrer une adresse email valide';
  },

  // Validation de mot de passe
  password: (value, minLength = 8) => {
    if (!value) return 'Le mot de passe est requis';
    if (value.length < minLength) 
      return `Le mot de passe doit contenir au moins ${minLength} caractères`;
    
    // Vérifications supplémentaires (majuscule, minuscule, chiffre, caractère spécial)
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasUppercase) return 'Le mot de passe doit contenir une majuscule';
    if (!hasLowercase) return 'Le mot de passe doit contenir une minuscule';
    if (!hasNumber) return 'Le mot de passe doit contenir un chiffre';
    if (!hasSpecialChar) return 'Le mot de passe doit contenir un caractère spécial';

    return null;
  },

  // Validation de champ requis
  required: (value) => {
    return value && value.toString().trim() !== '' 
      ? null 
      : 'Ce champ est requis';
  },

  // Validation de longueur
  length: (value, min, max) => {
    if (!value) return null;
    const length = value.toString().trim().length;
    
    if (min && length < min) 
      return `Minimum ${min} caractères requis`;
    
    if (max && length > max) 
      return `Maximum ${max} caractères autorisés`;
    
    return null;
  },

  // Validation de correspondance
  match: (value, comparison, fieldName = 'Champ') => {
    return value === comparison 
      ? null 
      : `${fieldName} ne correspond pas`;
  }
};

// Créer un validateur composite
export const composeValidators = (...validators) => {
  return (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
};

export default useForm;
