import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaFilter, 
  FaSearch, 
  FaSync,
  FaSwimmingPool,
  FaSwimmer,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
  FaRulerHorizontal,
  FaLayerGroup
} from 'react-icons/fa';
import { getWorkouts, deleteWorkout } from '../../services/workouts';
import axios from 'axios';

/**
 * 🇬🇧 User's workouts list component with table display
 * This component displays a table of swimming workouts with sorting and filtering
 * 
 * 🇫🇷 Composant de liste des séances d'entraînement avec affichage en tableau
 * Ce composant affiche un tableau des séances de natation avec tri et filtrage
 */
const UserWorkoutsList = () => {
  const navigate = useNavigate();
  
  /**
   * 🇬🇧 State management for the component
   * 
   * 🇫🇷 Gestion des états du composant
   */
  const [workouts, setWorkouts] = useState([]);
  const [workoutsWithStats, setWorkoutsWithStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: 'title',
    direction: 'ascending'
  });

  // Catégories de séances
  const workoutCategories = ['Aero 1', 'Vitesse', 'Mixte', 'Technique', 'Récupération'];

  /**
   * 🇬🇧 Fetch workouts and their details from API
   * 
   * 🇫🇷 Récupération des séances et leurs détails depuis l'API
   */
  const fetchWorkouts = useCallback(async () => {
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
      console.error('Erreur lors de la récupération des séances:', err);
      setError('Impossible de charger les séances. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  /**
   * 🇬🇧 Request sorting by column
   * 
   * 🇫🇷 Demander le tri par colonne
   */
  const requestSort = useCallback((key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  /**
   * 🇬🇧 Get sort indicator icon
   * 
   * 🇫🇷 Obtenir l'icône d'indicateur de tri
   */
  const getSortIcon = useCallback((key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? 
        <FaSortAmountUp className="ms-1" /> : 
        <FaSortAmountDown className="ms-1" />;
    }
    return <FaSort className="ms-1 text-muted opacity-50" />;
  }, [sortConfig]);

  /**
   * 🇬🇧 Apply sorting and filtering to workouts
   * 
   * 🇫🇷 Appliquer le tri et le filtrage aux séances
   */
  const sortedFilteredWorkouts = useMemo(() => {
    // Filtrer les séances
    let filteredItems = workoutsWithStats.filter(workout => {
      const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (workout.description && workout.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || workout.workout_category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Trier les séances
    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredItems;
  }, [workoutsWithStats, searchTerm, categoryFilter, sortConfig]);

  // Pagination
  const paginationData = useMemo(() => {
    const pageCount = Math.ceil(sortedFilteredWorkouts.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentWorkouts = sortedFilteredWorkouts.slice(offset, offset + itemsPerPage);
    return { pageCount, currentWorkouts };
  }, [sortedFilteredWorkouts, currentPage, itemsPerPage]);

  /**
   * 🇬🇧 Format distance with appropriate units
   * 
   * 🇫🇷 Formater la distance avec les unités appropriées
   */
  const formatDistance = useCallback((meters) => {
    if (meters >= 1000) {
      return `${(meters/1000).toFixed(1)} km`;
    }
    return `${meters} m`;
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
      {/* En-tête */}
      <div>
        <h1 className="display-6 fw-bold mb-4 title-swim">Séances</h1>
      </div>
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
              <div className="d-flex gap-2">
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
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={fetchWorkouts}
                  title="Rafraîchir"
                >
                  <FaSync />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Tableau */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th 
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('title')}
                  >
                    Titre {getSortIcon('title')}
                  </th>
                  <th 
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('workout_category')}
                  >
                    Catégorie {getSortIcon('workout_category')}
                  </th>
                  <th 
                    className="text-center"
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('totalDistance')}
                  >
                    <FaRulerHorizontal className="me-1" /> 
                    Distance {getSortIcon('totalDistance')}
                  </th>
                  <th className="text-center" style={{width: '150px'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginationData.currentWorkouts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Aucune séance ne correspond à vos critères de recherche.
                    </td>
                  </tr>
                ) : (
                  paginationData.currentWorkouts.map((workout) => (
                    <tr key={workout.id}>
                      <td>
                        <span className="fw-medium">{workout.title}</span>
                      </td>
                      <td>
                        <span className={`badge bg-${
                          workout.workout_category === 'Aero 1' ? 'success' :
                          workout.workout_category === 'Vitesse' ? 'danger' :
                          workout.workout_category === 'Technique' ? 'info' :
                          workout.workout_category === 'Récupération' ? 'warning' :
                          'secondary'
                        }`}>
                          {workout.workout_category || 'Non catégorisé'}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-info text-dark">
                          <FaSwimmer className="me-1" /> {formatDistance(workout.totalDistance)}
                        </span>
                      </td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/user/workouts/${workout.id}`)}
                          title="Voir cette séance"
                        >
                          <FaEye className="me-2" /> Voir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {sortedFilteredWorkouts.length > itemsPerPage && (
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
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="ms-2">éléments</span>
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
                
                {[...Array(paginationData.pageCount)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === paginationData.pageCount - 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === paginationData.pageCount - 1}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(UserWorkoutsList);