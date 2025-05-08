import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  options = [],
  as = 'input',
  rows,
  placeholder,
  disabled = false,
  className = '',
  ariaDescribedby
}) => {
  // Générer des IDs uniques pour l'accessibilité
  const id = `field-${name}`;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = ariaDescribedby || errorId;

  const renderField = () => {
    const commonProps = {
      id,
      name,
      value,
      onChange,
      disabled,
      isInvalid: !!error,
      required,
      placeholder,
      'aria-describedby': describedBy,
      'aria-invalid': !!error
    };

    if (as === 'select') {
      return (
        <Form.Select {...commonProps}>
          <option value="">{placeholder || 'Sélectionner...'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      );
    }

    if (as === 'textarea') {
      return (
        <Form.Control 
          {...commonProps}
          as="textarea" 
          rows={rows || 3}
        />
      );
    }

    return (
      <Form.Control 
        {...commonProps}
        type={type}
      />
    );
  };

  return (
    <Form.Group className={`mb-3 ${className}`}>
      {label && (
        <Form.Label htmlFor={id}>
          {label}
          {required && <span className="text-danger ms-1" aria-hidden="true">*</span>}
          {required && <span className="visually-hidden">(obligatoire)</span>}
        </Form.Label>
      )}
      {renderField()}
      {error && <Form.Control.Feedback type="invalid" id={errorId}>{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  as: PropTypes.oneOf(['input', 'select', 'textarea']),
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  ariaDescribedby: PropTypes.string
};

export default FormField;