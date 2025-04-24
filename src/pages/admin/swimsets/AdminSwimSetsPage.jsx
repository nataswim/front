import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
 
// Import direct des méthodes sans passer par le service
import axios from 'axios';

const AdminSwimSetsPage = () => {
  const navigate = useNavigate();
  const [swimSets, setSwimSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction de récupération qui contourne le service api
  const fetchSwimSets = async () => {
    try {
      setLoading(true);
      console.log('Récupération des séries de natation...');
      
      // Récupérer le token JWT stocké
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Appel direct sans passer par le service api.js
      const response = await axios.get('http://127.0.0.1:8000/api/swim-sets', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        withCredentials: true
      });
      
      console.log('Réponse:', response.data);
      setSwimSets(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des séries:', err);
      setError('Impossible de charger les séries. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwimSets();
  }, []);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-0">Gestion des Séries</h1>
          <p className="text-muted mb-0">
            {swimSets.length} série{swimSets.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center"
          onClick={() => navigate('/admin/swim-sets/new')}
        >
          <FaPlus className="me-2" /> Nouvelle série
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Table View */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Exercise</th>
                  <th>Distance</th>
                  <th>Répétitions</th>
                  <th>Repos</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {swimSets.length > 0 ? (
                  swimSets.map(set => (
                    <tr key={set.id}>
                      <td>{set.id}</td>
                      <td>Exercice #{set.exercise_id}</td>
                      <td>{set.set_distance}m</td>
                      <td>{set.set_repetition || 1}</td>
                      <td>{set.rest_time || 0}s</td>
                      <td>
                        <div className="d-flex justify-content-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => navigate(`/admin/swim-sets/${set.id}`)}
                            title="Voir les détails"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary me-1"
                            onClick={() => navigate(`/admin/swim-sets/${set.id}/edit`)}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              if (window.confirm('Êtes-vous sûr de vouloir supprimer cette série ?')) {
                                // Appel direct sans passer par le service api.js
                                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                                axios.delete(`http://127.0.0.1:8000/api/swim-sets/${set.id}`, {
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Authorization': token ? `Bearer ${token}` : ''
                                  },
                                  withCredentials: true
                                }).then(() => {
                                  fetchSwimSets();
                                }).catch(err => {
                                  console.error('Erreur lors de la suppression:', err);
                                  setError('Erreur lors de la suppression: ' + err.message);
                                });
                              }
                            }}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Aucune série disponible.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSwimSetsPage;