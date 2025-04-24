import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

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
      >
        <FaArrowLeft className="me-2" /> Retour à la liste
      </Button>

      <Card className="shadow">
        <Card.Header className="bg-white">
          <Card.Title className="mb-0">{title}</Card.Title>
        </Card.Header>

        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
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
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" /> Enregistrer
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

export default FormContainer;