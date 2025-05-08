import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import PropTypes from 'prop-types';

const FormContainer = ({
  title,
  children,
  onSubmit,
  onBack,
  isLoading = false,
  isSaving = false,
  error = null
}) => {
  return (
    <div className="container py-4">
      <Button 
        variant="outline-primary" 
        className="mb-4" 
        onClick={onBack}
        aria-label="Retour à la liste"
      >
        <FaArrowLeft className="me-2" aria-hidden="true" /> Retour à la liste
      </Button>

      <Card className="shadow">
        <Card.Header className="bg-white">
          <Card.Title className="mb-0">{title}</Card.Title>
        </Card.Header>

        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5" role="status" aria-live="polite">
              <div className="spinner-border text-primary" aria-hidden="true">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {children}

              <div className="text-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSaving}
                  aria-busy={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" aria-hidden="true" /> Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

FormContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isSaving: PropTypes.bool,
  error: PropTypes.string
};

export default FormContainer;