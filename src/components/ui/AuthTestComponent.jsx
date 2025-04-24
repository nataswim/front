import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaKey, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Composant pour tester l'état d'authentification
 * Ce composant aide à vérifier si l'utilisateur est correctement authentifié
 */
const AuthTestComponent = () => {
  const [authStatus, setAuthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  // Tester l'authentification
  const testAuth = async () => {
    setLoading(true);
    
    try {
      // Récupérer le token stocké
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setAuthStatus({
          authenticated: false,
          message: "Aucun token d'authentification trouvé dans le stockage local ou de session.",
          error: null,
          details: {
            localStorage: localStorage.getItem('token') ? 'Token présent' : 'Aucun token',
            sessionStorage: sessionStorage.getItem('token') ? 'Token présent' : 'Aucun token'
          }
        });
        setLoading(false);
        return;
      }
      
      // Tester l'authentification avec l'API
      const response = await axios.get('http://127.0.0.1:8000/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setAuthStatus({
        authenticated: true,
        user: response.data,
        message: "Authentification réussie",
        token: {
          exists: true,
          preview: `${token.slice(0, 15)}...${token.slice(-10)}`
        }
      });
    } catch (error) {
      console.error('Erreur de test d\'authentification:', error);
      
      setAuthStatus({
        authenticated: false,
        message: "Échec de l'authentification",
        error: error.message,
        details: {
          status: error.response?.status,
          data: error.response?.data
        }
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card my-4">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="h5 mb-0">
            <FaUser className="me-2 text-primary" />
            Test d'authentification
          </h3>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Réduire' : 'Développer'}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="card-body">
          <div className="alert alert-info">
            <p className="mb-0">
              <FaKey className="me-2" />
              Ce composant permet de vérifier si vous êtes correctement authentifié auprès de l'API.
              L'accès aux données (exercices, séances, plans) nécessite une authentification valide.
            </p>
          </div>
          
          <button 
            className="btn btn-primary mb-4" 
            onClick={testAuth} 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Test en cours...
              </>
            ) : (
              <>
                <FaKey className="me-2" />
                Tester l'authentification
              </>
            )}
          </button>
          
          {authStatus && (
            <div className={`alert ${authStatus.authenticated ? 'alert-success' : 'alert-danger'}`}>
              <h4 className="alert-heading">
                {authStatus.authenticated ? (
                  <>
                    <FaCheck className="me-2" /> Authentifié
                  </>
                ) : (
                  <>
                    <FaTimes className="me-2" /> Non authentifié
                  </>
                )}
              </h4>
              <p>{authStatus.message}</p>
              
              {authStatus.authenticated ? (
                <div>
                  <p><strong>Utilisateur:</strong> {authStatus.user?.name || authStatus.user?.email || JSON.stringify(authStatus.user)}</p>
                  <p><strong>Token:</strong> {authStatus.token.preview}</p>
                </div>
              ) : (
                <div>
                  {authStatus.error && (
                    <p><strong>Erreur:</strong> {authStatus.error}</p>
                  )}
                  <div className="mt-3">
                    <h5 className="h6">Conseils de résolution:</h5>
                    <ul className="mb-0">
                      <li>Essayez de vous déconnecter et de vous reconnecter</li>
                      <li>Vérifiez que votre session n'a pas expiré</li>
                      <li>Assurez-vous que le backend est correctement configuré pour l'authentification</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {authStatus && !authStatus.authenticated && (
            <div className="alert alert-warning mt-3">
              <FaExclamationTriangle className="me-2" />
              <strong>Attention:</strong> Sans authentification valide, vous ne pourrez pas accéder aux données comme les exercices, séances et plans.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthTestComponent;