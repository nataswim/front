import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaFilter, 
  FaSearch, 
  FaSync,
  FaSwimmer,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
  FaLayerGroup
} from 'react-icons/fa';
import { getWorkouts, deleteWorkout } from '../../../services/workouts';
import axios from 'axios';

const AdminWorkoutsPage = () => {
  const navigate = useNavigate();
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

  // Workout categories
  const workoutCategories = ['Aero 1', 'Vitesse', 'Mixte', 'Technique', 'Récupération'];

  // Fetch workouts and their details
  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await getWorkouts();
      setWorkouts(response.data);
      
      // Fetch additional stats for each workout
      const workoutsWithAdditionalData = await Promise.all(
        response.data.map(async (workout) => {
          try {
            // Fetch swim sets
            const setsResponse = await axios.get(`http://127.0.0.1:8000/api/workouts/${workout.id}/swim-sets`);
            const sets = setsResponse.data;
            const setsCount = sets.length;
            
            return {
              ...workout,
              setsCount
            };
          } catch (err) {
            console.error(`Error fetching details for workout ${workout.id}:`, err);
            return {
              ...workout,
              setsCount: 0
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
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sort indicator icon
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? 
        <FaSortAmountUp className="ms-1" /> : 
        <FaSortAmountDown className="ms-1" />;
    }
    return <FaSort className="ms-1 text-muted" />;
  };

  // Apply sorting and filtering
  const getSortedWorkouts = () => {
    let filteredItems = workoutsWithStats.filter(workout => {
      const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || workout.workout_category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

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
  };

  // Get current items for pagination
  const sortedFilteredWorkouts = getSortedWorkouts();
  const pageCount = Math.ceil(sortedFilteredWorkouts.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentWorkouts = sortedFilteredWorkouts.slice(offset, offset + itemsPerPage);

  // Delete handler
  const handleDelete = async (id, title) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la séance "${title}" ?`)) {
      try {
        await deleteWorkout(id);
        await fetchWorkouts();
      } catch (err) {
        setError('Erreur lors de la suppression: ' + err.message);
      }
    }
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
                Gestion des Séances
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted mb-0">
            {workouts.length} séance{workouts.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button 
          className="btn btn-success btn-lg d-flex align-items-center"
          onClick={() => navigate('/admin/workouts/new')}
        >
          <FaPlus className="me-2" /> Ajouter Une Séance
        </button>
      </div>

      {/* Filters */}
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
                  <th 
                    className="cursor-pointer"
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('title')}
                  >
                    Titre {getSortIcon('title')}
                  </th>
                  <th 
                    className="cursor-pointer"
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('workout_category')}
                  >
                    Catégorie {getSortIcon('workout_category')}
                  </th>
                  <th 
                    className="cursor-pointer text-center"
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('setsCount')}
                  >
                    <FaLayerGroup className="me-1" /> 
                    Séries {getSortIcon('setsCount')}
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentWorkouts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Aucune séance ne correspond à vos critères de recherche.
                    </td>
                  </tr>
                ) : (
                  currentWorkouts.map((workout) => (
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
                        <span className="badge bg-secondary">
                          <FaLayerGroup className="me-1" /> {workout.setsCount}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/admin/workouts/${workout.id}`)}
                            title="Voir détails"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => navigate(`/admin/workouts/${workout.id}/edit`)}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(workout.id, workout.title)}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
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
        <div className="card">
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
    </div>
  );
};

export default AdminWorkoutsPage;