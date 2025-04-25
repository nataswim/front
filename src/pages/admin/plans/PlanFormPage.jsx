import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaSwimmer, 
  FaSearch, 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaEye,
  FaRegCheckSquare,
  FaRegSquare,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaRulerHorizontal,
  FaLayerGroup,
  FaInfoCircle,
  FaLink,
  FaUnlink,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { getPlan, createPlan, updatePlan } from '../../../services/plans';
import { getWorkoutsForPlan, addWorkoutToPlan, removeWorkoutFromPlan } from '../../../services/planWorkouts';
import { getUsers } from '../../../services/users';
import TextEditor from '../../../components/ui/forms/TextEditor';
import "quill/dist/quill.snow.css"; // Import du CSS pour TextEditor
import axios from 'axios';

/**
 * 🇬🇧 Component for creating and editing training plans
 * 🇫🇷 Composant pour créer et modifier des plans d'entraînement
 */
const PlanFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    plan_category: '',
    user_id: ''
  });

  // Workouts state
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [currentPlanWorkouts, setCurrentPlanWorkouts] = useState([]);
  const [workoutSearchTerm, setWorkoutSearchTerm] = useState('');
  const [workoutFilter, setWorkoutFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Augmenté à 10 comme dans WorkoutFormPage

  // Status states
  const [loading, setLoading] = useState(false);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  // Plan categories
  const planCategories = ['Débutant', 'Intermédiaire', 'Avancé'];

  // Workout categories
  const workoutCategories = ['Aero 1', 'Vitesse', 'Mixte', 'Technique', 'Récupération'];

  // Load plan data if in edit mode
  useEffect(() => {
    const fetchPlan = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await getPlan(id);
          const planData = response.data;
          
          setFormData({
            title: planData.title || '',
            description: planData.description || '',
            plan_category: planData.plan_category || '',
            user_id: planData.user_id ? planData.user_id.toString() : ''
          });
          
          // Fetch associated workouts
          const workoutsResponse = await getWorkoutsForPlan(id);
          const currentWorkouts = workoutsResponse.data || [];
          setCurrentPlanWorkouts(currentWorkouts);
          
          // Set the initially selected workouts
          setSelectedWorkouts(currentWorkouts.map(workout => workout.id));
          
          setLoading(false);
        } catch (err) {
          console.error('Erreur lors du chargement du plan:', err);
          setError(`Erreur lors du chargement du plan: ${err.response?.data?.message || err.message}`);
          setLoading(false);
        }
      }
    };

    fetchPlan();
  }, [id, isEditMode]);

  // Load users and workouts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch users
        const usersResponse = await getUsers();
        setUsers(usersResponse.data);
        
        // Fetch all workouts
        setWorkoutsLoading(true);
        const workoutsResponse = await axios.get('http://127.0.0.1:8000/api/workouts');
        
        // Enrich workouts with additional data
        const workoutsWithStats = await Promise.all(
          workoutsResponse.data.map(async (workout) => {
            try {
              // Get swim sets for the workout to calculate stats
              const setsResponse = await axios.get(`http://127.0.0.1:8000/api/workouts/${workout.id}/swim-sets`);
              const sets = setsResponse.data || [];
              
              // Calculate total distance
              const totalDistance = sets.reduce((acc, set) => {
                return acc + ((set.set_distance || 0) * (set.set_repetition || 1));
              }, 0);
              
              // Count sets
              const setsCount = sets.length;
              
              return {
                ...workout,
                totalDistance,
                setsCount
              };
            } catch (err) {
              console.error(`Error fetching details for workout ${workout.id}:`, err);
              return {
                ...workout,
                totalDistance: 0,
                setsCount: 0
              };
            }
          })
        );
        
        setAllWorkouts(workoutsWithStats);
        setWorkoutsLoading(false);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Erreur lors du chargement des données.");
        setWorkoutsLoading(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle description text editor changes
  const handleDescriptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      plan_category: prev.plan_category === category ? '' : category
    }));
  };

  // Handle workout toggle
  const handleWorkoutToggle = (workoutId) => {
    setSelectedWorkouts(prev => {
      if (prev.includes(workoutId)) {
        return prev.filter(id => id !== workoutId);
      } else {
        return [...prev, workoutId];
      }
    });
  };

  // Handle workout association
  const handleWorkoutAssociate = (workoutId) => {
    if (!selectedWorkouts.includes(workoutId)) {
      setSelectedWorkouts(prev => [...prev, workoutId]);
    }
  };

  // Handle workout removal
  const handleWorkoutRemove = (workoutId) => {
    if (selectedWorkouts.includes(workoutId)) {
      setSelectedWorkouts(prev => prev.filter(id => id !== workoutId));
    }
  };

  // Sort and filter workouts
  const getSortedFilteredWorkouts = () => {
    // Filter workouts based on search term and category
    let filteredWorkouts = allWorkouts.filter(workout => {
      const matchesSearch = workout.title.toLowerCase().includes(workoutSearchTerm.toLowerCase()) ||
                        (workout.description && workout.description.toLowerCase().includes(workoutSearchTerm.toLowerCase()));
      const matchesCategory = workoutFilter === 'all' || workout.workout_category === workoutFilter;
      return matchesSearch && matchesCategory;
    });
    
    // Sort workouts
    if (sortConfig.key) {
      filteredWorkouts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredWorkouts;
  };

  // Pagination
  const sortedFilteredWorkouts = getSortedFilteredWorkouts();
  const pageCount = Math.ceil(sortedFilteredWorkouts.length / itemsPerPage);
  const indexOfLastWorkout = currentPage * itemsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - itemsPerPage;
  const currentWorkouts = sortedFilteredWorkouts.slice(indexOfFirstWorkout, indexOfLastWorkout);

  // Request sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort direction icon
  const getSortDirectionIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  // Format distance
  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  // Render pagination controls
  const renderPagination = () => {
    if (pageCount <= 1) return null;

    const handlePageChange = (e, newPage) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentPage(newPage);
    };

    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button 
          className="btn btn-sm btn-outline-secondary" 
          onClick={(e) => handlePageChange(e, currentPage - 1)}
          disabled={currentPage === 1}
          type="button"
        >
          <FaChevronLeft /> Précédent
        </button>
        
        <div className="px-2">
          Page {currentPage} sur {pageCount}
        </div>
        
        <button 
          className="btn btn-sm btn-outline-secondary" 
          onClick={(e) => handlePageChange(e, currentPage + 1)}
          disabled={currentPage === pageCount}
          type="button"
        >
          Suivant <FaChevronRight />
        </button>
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title) {
      setError('Le titre est requis');
      return;
    }

    if (!formData.user_id) {
      setError('Veuillez sélectionner un créateur');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Préparer les données à envoyer
      const submitData = {
        title: formData.title,
        description: formData.description,
        plan_category: formData.plan_category || null,
        user_id: parseInt(formData.user_id)
      };

      let planId;
      if (isEditMode) {
        await updatePlan(id, submitData);
        planId = id;
      } else {
        const response = await createPlan(submitData);
        planId = response.data.id;
      }

      // Associate workouts with plan
      if (isEditMode) {
        // Get current workout IDs
        const currentWorkoutIds = currentPlanWorkouts.map(workout => workout.id);
        
        // Determine which workouts to add and remove
        const workoutsToAdd = selectedWorkouts.filter(id => !currentWorkoutIds.includes(id));
        const workoutsToRemove = currentWorkoutIds.filter(id => !selectedWorkouts.includes(id));
        
        // Add new workouts
        for (const workoutId of workoutsToAdd) {
          try {
            await addWorkoutToPlan(planId, workoutId);
          } catch (err) {
            console.error(`Error associating workout ${workoutId}:`, err);
          }
        }
        
        // Remove workouts no longer needed
        for (const workoutId of workoutsToRemove) {
          try {
            await removeWorkoutFromPlan(planId, workoutId);
          } catch (err) {
            console.error(`Error removing workout ${workoutId}:`, err);
          }
        }
      } else {
        // For new plans, simply add all selected workouts
        for (const workoutId of selectedWorkouts) {
          try {
            await addWorkoutToPlan(planId, workoutId);
          } catch (err) {
            console.error(`Error associating workout ${workoutId}:`, err);
          }
        }
      }

      // Redirect to plan list
      navigate('/admin/plans');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(`Erreur lors de l'enregistrement: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Titre Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary-subtle">
              <h2 className="card-title mb-0">
                <FaPlus className="me-2" />
                {isEditMode ? "Modification d'un Plan" : "Création d'un Plan"}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <br />
      
      <button 
        className="btn btn-success btn-lg d-flex align-items-center" 
        onClick={() => navigate('/admin/plans')}
      >
        <FaArrowLeft className="me-2" /> Retour à la liste
      </button>
      <br />

      <div className="card shadow mb-4">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">
            {isEditMode ? "Modifier le plan" : "Créer un nouveau plan"}
          </h5>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  <FaInfoCircle className="me-2" />
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="title" className="form-label">Titre</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <TextEditor 
                  value={formData.description} 
                  onChange={handleDescriptionChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label d-block">Catégorie</label>
                <div className="d-flex flex-wrap gap-2">
                  {planCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`btn ${formData.plan_category === category ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="user_id" className="form-label">Créé par</label>
                <select
                  className="form-select"
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner un créateur</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username || user.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Séances d'entraînement */}
              <div className="card mb-4">
                <div className="card-header bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <FaSwimmer className="me-2 text-primary" /> 
                      Séances d'entraînement
                      {selectedWorkouts.length > 0 && (
                        <span className="badge bg-primary ms-2">{selectedWorkouts.length}</span>
                      )}
                    </h6>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row mb-3 align-items-center">
                    <div className="col-md-6">
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaSearch />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Rechercher une séance..."
                          value={workoutSearchTerm}
                          onChange={(e) => {
                            setWorkoutSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                          }}
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
                            value={workoutFilter}
                            onChange={(e) => {
                              setWorkoutFilter(e.target.value);
                              setCurrentPage(1); // Reset to first page on filter change
                            }}
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

                  {workoutsLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                      </div>
                      <p className="mt-2">Chargement des séances...</p>
                    </div>
                  ) : allWorkouts.length === 0 ? (
                    <div className="alert alert-info">
                      <FaInfoCircle className="me-2" />
                      Aucune séance disponible. Veuillez d'abord créer des séances.
                      <div className="mt-2">
                        <button 
                          type="button"
                          className="btn btn-primary btn-sm" 
                          onClick={() => navigate('/admin/workouts/new')}
                        >
                          <FaPlus className="me-1" /> Créer une séance
                        </button>
                      </div>
                    </div>
                  ) : sortedFilteredWorkouts.length === 0 ? (
                    <div className="alert alert-warning">
                      <FaInfoCircle className="me-2" />
                      Aucune séance ne correspond à votre recherche.
                    </div>
                  ) : (
                    <>
                      {/* Selected workouts summary */}
                      {selectedWorkouts.length > 0 && (
                        <div className="alert alert-success mb-3">
                          <FaRegCheckSquare className="me-2" />
                          {selectedWorkouts.length} {selectedWorkouts.length === 1 ? 'séance sélectionnée' : 'séances sélectionnées'}
                          {/* Button to deselect all workouts */}
                          <button 
                            type="button"
                            className="btn btn-sm btn-outline-secondary float-end"
                            onClick={() => setSelectedWorkouts([])}
                          >
                            Tout désélectionner
                          </button>
                        </div>
                      )}

                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th style={{width: "50px"}}></th>
                              <th 
                                style={{cursor: 'pointer'}}
                                onClick={() => requestSort('title')}
                                className="d-flex align-items-center"
                              >
                                Titre {getSortDirectionIcon('title')}
                              </th>
                              <th 
                                style={{cursor: 'pointer'}}
                                onClick={() => requestSort('workout_category')}
                              >
                                Catégorie {getSortDirectionIcon('workout_category')}
                              </th>
                              <th style={{width: "150px"}} className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentWorkouts.map((workout) => (
                              <tr 
                                key={workout.id}
                                className={selectedWorkouts.includes(workout.id) ? 'table-primary' : ''}
                              >
                                <td className="text-center">
                                  {selectedWorkouts.includes(workout.id) ? (
                                    <FaRegCheckSquare className="text-primary" />
                                  ) : (
                                    <FaRegSquare className="text-muted" />
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <FaSwimmer className="text-primary me-2" />
                                    {workout.title}
                                  </div>
                                </td>
                                <td>
                                  {workout.workout_category ? (
                                    <span className={`badge bg-${
                                      workout.workout_category === 'Aero 1' ? 'success' :
                                      workout.workout_category === 'Vitesse' ? 'danger' :
                                      workout.workout_category === 'Technique' ? 'info' :
                                      workout.workout_category === 'Récupération' ? 'warning' : 'secondary'
                                    }`}>
                                      {workout.workout_category}
                                    </span>
                                  ) : (
                                    <span className="text-muted">—</span>
                                  )}
                                </td>
                                <td className="text-center">
                                  <div className="btn-group btn-group-sm">
                                    <button 
                                      type="button"
                                      className="btn btn-outline-success"
                                      onClick={() => handleWorkoutAssociate(workout.id)}
                                      disabled={selectedWorkouts.includes(workout.id)}
                                      title="Associer cette séance"
                                    >
                                      <FaLink />
                                    </button>
                                    <button 
                                      type="button"
                                      className="btn btn-outline-danger"
                                      onClick={() => handleWorkoutRemove(workout.id)}
                                      disabled={!selectedWorkouts.includes(workout.id)}
                                      title="Enlever cette séance"
                                    >
                                      <FaUnlink />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary"
                                      onClick={() => navigate(`/admin/workouts/${workout.id}`)}
                                      title="Voir détails"
                                    >
                                      <FaEye />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {renderPagination()}

                      {/* Items per page selector */}
                      <div className="d-flex justify-content-center align-items-center mt-3">
                        <span className="me-2">Afficher</span>
                        <select 
                          className="form-select form-select-sm" 
                          style={{width: '70px'}} 
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1); // Reset to first page
                          }}
                        >
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="20">20</option>
                          <option value="25">25</option>
                        </select>
                        <span className="ms-2">par page</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-danger btn-lg d-flex align-items-center"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" /> Enregistrer Ce Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanFormPage;