import React from 'react';
import { Form } from 'react-bootstrap';

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
  className = ''
}) => {
  const renderField = () => {
    const commonProps = {
      id: name,
      name,
      value,
      onChange,
      disabled,
      isInvalid: !!error,
      required,
      placeholder
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
        <Form.Label>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}
      {renderField()}
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default FormField;