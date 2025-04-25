import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye, FaEdit, FaTrash, FaSwimmer } from 'react-icons/fa';
 
// Import direct des méthodes sans passer par le service
import axios from 'axios';

/**
 * 🇬🇧 Admin Swim Sets Page - Management of swimming series
 * 🇫🇷 Page d'administration des séries de natation - Gestion des séries
 */
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

  // Calculer le total pour chaque série (distance × répétition)
  const calculateTotal = (set) => {
    const distance = set.set_distance || 0;
    const repetition = set.set_repetition || 1;
    return distance * repetition;
  };

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
      {/* Titre Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary-subtle">
              <h2 className="card-title mb-0">
                <FaSwimmer className="me-2" />
                Gestion des Séries
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted mb-0">
            {swimSets.length} série{swimSets.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button 
          className="btn btn-success btn-lg d-flex align-items-center"
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
      <div className="card shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Distance</th>
                  <th>Répétitions</th>
                  <th>Total</th>
                  <th>Exercice</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {swimSets.length > 0 ? (
                  swimSets.map(set => (
                    <tr key={set.id}>
                      <td>
                        <span className="fw-medium">{set.set_distance}m</span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {set.set_repetition || 1}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {calculateTotal(set)}m
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          Exercice #{set.exercise_id}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/admin/swim-sets/${set.id}`)}
                            title="Voir les détails"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
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
                    <td colSpan="5" className="text-center py-4">
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