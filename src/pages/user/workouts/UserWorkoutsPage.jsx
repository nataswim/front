// WorkoutsPage.jsx 
// //Pages accessibles après connexion 

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFilter, 
  FaSearch, 
  FaSwimmingPool, 
  FaRulerHorizontal, 
  FaInfoCircle,
  FaEye,
  FaTag,
  FaSwimmer,
  FaTint
} from 'react-icons/fa';
import Footer from '../../../components/template/Footer';
import { getWorkouts } from '../../../services/workouts';
import axios from 'axios';

/**
 * 🇬🇧 User's workouts dashboard page with card display
 * 
 * 🇫🇷 Page tableau de bord des séances d'entraînement avec affichage en cartes
 */
const UserWorkoutsPage = () => {
  // États
  const [workouts, setWorkouts] = useState([]);
  const [workoutsWithStats, setWorkoutsWithStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Catégories de séances
  const workoutCategories = ['Aero 1', 'Vitesse', 'Mixte', 'Technique', 'Récupération'];

  /**
   * 🇬🇧 Fetch workouts and their details from API
   * 
   * 🇫🇷 Récupération des séances et leurs détails depuis l'API
   */
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const response = await getWorkouts();
        setWorkouts(response.data);
        
        // Récupérer des statistiques supplémentaires pour chaque séance
        const workoutsWithAdditionalData = await Promise.all(
          response.data.map(async (workout) => {
            try {
              // Récupérer les exercices
              const exercisesResponse = await axios.get(`http://127.0.0.1:8000/api/workouts/${workout.id}/exercises`);
              const exercisesCount = exercisesResponse.data.length;
              
              // Récupérer les séries
              const setsResponse = await axios.get(`http://127.0.0.1:8000/api/workouts/${workout.id}/swim-sets`);
              const sets = setsResponse.data;
              const setsCount = sets.length;
              
              // Calculer la distance totale
              const totalDistance = sets.reduce((acc, set) => {
                return acc + ((set.set_distance || 0) * (set.set_repetition || 1));
              }, 0);
              
              return {
                ...workout,
                exercisesCount,
                setsCount,
                totalDistance
              };
            } catch (err) {
              console.error(`Erreur lors de la récupération des détails pour la séance ${workout.id}:`, err);
              return {
                ...workout,
                exercisesCount: 0,
                setsCount: 0,
                totalDistance: 0
              };
            }
          })
        );
        
        setWorkoutsWithStats(workoutsWithAdditionalData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des séances:', err);
        setError('Impossible de charger les séances. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Filtrer les séances
  const filteredWorkouts = workoutsWithStats.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || workout.workout_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const pageCount = Math.ceil(filteredWorkouts.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentWorkouts = filteredWorkouts.slice(offset, offset + itemsPerPage);

  /**
   * 🇬🇧 Format distance with appropriate units
   * 
   * 🇫🇷 Formater la distance avec les unités appropriées
   */
  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters/1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  // Obtenir la couleur du badge selon la catégorie
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Aero 1': return 'success';
      case 'Vitesse': return 'danger';
      case 'Technique': return 'info';
      case 'Récupération': return 'warning';
      case 'Mixte': return 'purple';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <>
        <main className="container py-4">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="container-fluid py-4">
        {/* En-tête */}
        <h1 className="h2 mb-0 title-swim">Mes Séances d'Entraînement</h1>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-muted mb-0">
              {workouts.length} séance{workouts.length > 1 ? 's' : ''} au total
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher une séance..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaFilter />
                  </span>
                  <select
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Toutes les catégories</option>
                    {workoutCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Liste des séances */}
        {currentWorkouts.length === 0 ? (
          <div className="alert alert-info d-flex align-items-center" role="alert">
            <FaInfoCircle className="me-2" />
            Aucune séance ne correspond à vos critères de recherche.
          </div>
        ) : (
          <div className="row g-4">
            {currentWorkouts.map((workout) => (
              <div key={workout.id} className="col-md-6 col-xl-4">
                <div className="card h-100 shadow-sm hover-lift">
                  <div className="card-header bg-white border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge bg-${getCategoryBadgeColor(workout.workout_category)}`}>
                        {workout.workout_category || 'Non catégorisé'}
                      </span>
                      <small className="text-muted">
                        ID: {workout.id}
                      </small>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary text-white rounded-circle p-3 me-3">
                        <FaSwimmingPool />
                      </div>
                      <div>
                        <p>{workout.title}</p>
                        {workout.workout_category && (
                          <span className="badge bg-light text-dark">
                            <FaTag className="me-1" /> {workout.workout_category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="row g-2 mb-4">
                      <div className="col-12">
                        <div className="h4 card-title mb-1">
                          <FaRulerHorizontal className="me-2" />
                          {formatDistance(workout.totalDistance)}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center text-muted small">
                      <div className="d-flex align-items-center">
                        <FaSwimmer className="me-2" />
                        {workout.exercisesCount || 0} exercice{workout.exercisesCount !== 1 ? 's' : ''}
                      </div>
                      <div className="d-flex align-items-center">
                        <FaTint className="me-2" />
                        {workout.setsCount || 0} série{workout.setsCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-top-0 p-3">
                    <Link to={`/user/workouts/${workout.id}`} className="btn btn-outline-primary w-100">
                      <FaEye className="me-1" /> Voir les détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredWorkouts.length > itemsPerPage && (
          <div className="card mt-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <span className="me-2">Afficher</span>
                <select 
                  className="form-select form-select-sm" 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  style={{width: '70px'}}
                >
                  <option value="6">6</option>
                  <option value="9">9</option>
                  <option value="12">12</option>
                  <option value="15">15</option>
                </select>
                <span className="ms-2">séances</span>
              </div>
              
              <nav aria-label="Navigation des pages">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      &laquo;
                    </button>
                  </li>
                  
                  {[...Array(pageCount)].map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === pageCount - 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pageCount - 1}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default UserWorkoutsPage;