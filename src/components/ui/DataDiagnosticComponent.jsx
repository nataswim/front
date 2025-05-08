import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FaBug, FaDatabase, FaCheckCircle, FaExclamationTriangle, FaSyncAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Composant de diagnostic pour vérifier la disponibilité des données
 * Utilisez ce composant en mode développement pour résoudre les problèmes d'accès aux données
 */
const DataDiagnosticComponent = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showDataSample, setShowDataSample] = useState({});
  
  // Définition mémoïsée des endpoints pour éviter les recréations inutiles
  const endpoints = useMemo(() => [
    { name: 'Exercises', url: '/api/exercises' },
    { name: 'Workouts', url: '/api/workouts' },
    { name: 'Plans', url: '/api/plans' },
    { name: 'Mes Listes', url: '/api/mylists' }
  ], []);
  
  const testEndpoints = useCallback(async () => {
    setLoading(true);
    const newResults = {};
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Test de l'endpoint ${endpoint.url}`);
        const response = await axios.get(endpoint.url);
        
        let items = [];
        let structure = {};
        
        // Extraire les éléments, en s'adaptant au format de réponse
        if (Array.isArray(response.data)) {
          items = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          items = response.data.data;
        } else {
          console.warn(`Format de réponse inattendu pour ${endpoint.url}`, response.data);
        }
        
        // Extraire la structure du premier élément s'il existe
        if (items.length > 0) {
          structure = Object.keys(items[0]);
        }
        
        newResults[endpoint.name] = {
          success: true,
          status: response.status,
          items: items,
          count: items.length,
          structure: structure,
          error: null
        };
      } catch (error) {
        console.error(`Erreur lors du test de l'endpoint ${endpoint.url}:`, error);
        newResults[endpoint.name] = {
          success: false,
          status: error.response?.status || 'N/A',
          items: [],
          count: 0,
          structure: [],
          error: error.message
        };
      }
    }
    
    setResults(newResults);
    setLoading(false);
    setExpanded(true);
  }, [endpoints]);
  
  const toggleDataSample = useCallback((endpointName) => {
    setShowDataSample(prev => ({
      ...prev,
      [endpointName]: !prev[endpointName]
    }));
  }, []);
  
  // Mémoisation des résultats formatés pour éviter des recalculs inutiles
  const formattedResults = useMemo(() => {
    return Object.keys(results).map(endpointName => {
      const result = results[endpointName];
      return {
        name: endpointName,
        success: result.success,
        status: result.status,
        count: result.count,
        structure: result.structure.join(', '),
        items: result.items.slice(0, 2), // Limiter à 2 éléments pour l'affichage
        showSample: showDataSample[endpointName] || false
      };
    });
  }, [results, showDataSample]);
  
  return (
    <div className="card my-4">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="h5 mb-0">
            <FaBug className="me-2 text-danger" />
            Diagnostic des données (Admin/Dev)
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
              <FaDatabase className="me-2" />
              Ce composant permet de diagnostiquer la disponibilité des données dans l'application.
              Utilisez-le pour vérifier si les endpoints API fonctionnent correctement.
            </p>
          </div>
          
          <button 
            className="btn btn-primary mb-4" 
            onClick={testEndpoints} 
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSyncAlt className="me-2 fa-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <FaDatabase className="me-2" />
                Tester les endpoints
              </>
            )}
          </button>
          
          {formattedResults.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Endpoint</th>
                    <th>Statut</th>
                    <th>Nombre d'éléments</th>
                    <th>Structure</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedResults.map((result, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>
                          <strong>{result.name}</strong>
                        </td>
                        <td>
                          {result.success ? (
                            <span className="text-success">
                              <FaCheckCircle className="me-1" /> 
                              {result.status}
                            </span>
                          ) : (
                            <span className="text-danger">
                              <FaExclamationTriangle className="me-1" /> 
                              {result.status}
                            </span>
                          )}
                        </td>
                        <td>{result.count}</td>
                        <td>
                          <small className="text-muted">
                            {result.structure}
                          </small>
                        </td>
                        <td>
                          {result.count > 0 && (
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => toggleDataSample(result.name)}
                            >
                              {result.showSample ? (
                                <>
                                  <FaEyeSlash className="me-1" /> Cacher
                                </>
                              ) : (
                                <>
                                  <FaEye className="me-1" /> Voir
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                      {result.showSample && (
                        <tr>
                          <td colSpan="5" className="bg-light">
                            <div className="p-2">
                              <h6>Échantillon de données:</h6>
                              <pre className="mb-0" style={{ maxHeight: '200px', overflow: 'auto' }}>
                                {JSON.stringify(result.items, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {Object.keys(results).length > 0 && (
            <div className="mt-4">
              <h5>Conseils en cas de problème:</h5>
              <ol>
                <li><strong>Aucun élément trouvé:</strong> Vérifiez que vous avez créé des éléments dans la base de données.</li>
                <li><strong>Erreur d'accès:</strong> Vérifiez que vos routes API sont correctement configurées et accessibles.</li>
                <li><strong>Structure incorrecte:</strong> Vérifiez que la structure des données correspond à ce qui est attendu par l'application.</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(DataDiagnosticComponent);