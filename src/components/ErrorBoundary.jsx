import React, { Component } from 'react';
import ErrorComponent from './ErrorComponent';

/**
 * Composant ErrorBoundary pour capturer les erreurs de rendu React
 * Ce composant encapsule d'autres composants et attrape les erreurs qui se produisent pendant le rendu
 * 
 * Utilisation:
 * <ErrorBoundary>
 *   <VotreComposant />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  // Méthode appelée lorsqu'une erreur est détectée
  static getDerivedStateFromError(error) {
    // Mise à jour de l'état pour afficher l'interface de secours
    return { hasError: true };
  }

  // Méthode pour capturer les détails de l'erreur
  componentDidCatch(error, errorInfo) {
    // Mettre à jour l'état avec les informations d'erreur
    this.setState({ 
      error: error, 
      errorInfo: errorInfo 
    });

    // Journaliser l'erreur (voir service de journalisation)
    console.error("Erreur capturée par ErrorBoundary:", error, errorInfo);
    
    // Si vous avez un service de journalisation, l'appeler ici
    // logErrorService.logError(error, errorInfo);
  }

  render() {
    // Si une erreur est survenue, afficher l'interface de secours
    if (this.state.hasError) {
      // Vous pouvez personnaliser l'affichage de l'erreur ici
      return (
        <ErrorComponent
          title="Quelque chose s'est mal passé"
          message="Une erreur inattendue s'est produite dans l'application."
          code="ERR"
          showHomeButton={true}
          showBackButton={true}
        >
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-light rounded">
              <h6>Détails de l'erreur (mode développement uniquement):</h6>
              <pre className="text-danger">
                {this.state.error && this.state.error.toString()}
              </pre>
              <pre className="small text-muted">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
        </ErrorComponent>
      );
    }

    // Sinon, rendre les enfants normalement
    return this.props.children;
  }
}

export default ErrorBoundary;