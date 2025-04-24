import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaPlus, 
  FaTrash, 
  FaRegCheckSquare, 
  FaRegSquare,
  FaSwimmer,
  FaCalendarAlt,
  FaSearch,
  FaInfoCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { 
  getWorkout, 
  createWorkout, 
  updateWorkout, 
  getWorkoutExercises,
  addExerciseToWorkout
} from '../../../services/workouts';
import { 
  getSwimSetsForWorkout, 
  addSwimSetToWorkout, 
  removeSwimSetFromWorkout 
} from '../../../services/workoutSwimSets';
import { getUsers } from '../../../services/users';
import { getPlans, addWorkoutToPlan } from '../../../services/plans';
import { getSwimSets } from '../../../services/swimsets';
import { getExercise } from '../../../services/exercises';
import api from '../../../services/api';
import TextEditor from "../../../components/ui/forms/TextEditor";
import "quill/dist/quill.snow.css"; // Import du CSS pour TextEditor

/**
 * 🇬🇧 Component for creating and editing workouts
 * 🇫🇷 Composant pour créer et modifier des séances d'entraînement
 */
const WorkoutFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workout_category: '',
    user_id: ''
  });

  // Associated data
  const [allSets, setAllSets] = useState([]);
  const [selectedSets, setSelectedSets] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [currentWorkoutSets, setCurrentWorkoutSets] = useState([]);
  const [currentWorkoutPlans, setCurrentWorkoutPlans] = useState([]);

  // Search and filter state
  const [setsSearchTerm, setSetsSearchTerm] = useState('');
  const [plansSearchTerm, setPlansSearchTerm] = useState('');

  // Pagination state for sets
  const [setsCurrentPage, setSetsCurrentPage] = useState(1);
  const [setsPerPage, setSetsPerPage] = useState(5);

  // Pagination state for plans
  const [plansCurrentPage, setPlansCurrentPage] = useState(1);
  const [plansPerPage, setPlansPerPage] = useState(6);

  // Sorting state for sets
  const [setsSortConfig, setSetsSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });

  // Sorting state for plans
  const [plansSortConfig, setPlansSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });

  // Status states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  // Workout categories
  const workoutCategories = ['Aero 1', 'Vitesse', 'Mixte', 'Technique', 'Récupération'];

  /**
   * 🇬🇧 Load workout data if in edit mode
   * 🇫🇷 Charger les données de la séance en mode édition
   */
  useEffect(() => {
    const fetchWorkout = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          console.log(`Chargement de la séance ${id}...`);
          
          // Get workout data
          const response = await getWorkout(id);
          const workoutData = response.data;
          
          setFormData({
            title: workoutData.title || '',
            description: workoutData.description || '',
            workout_category: workoutData.workout_category || '',
            user_id: workoutData.user_id ? workoutData.user_id.toString() : ''
          });
          
          // Fetch associated swim sets using the service
          try {
            console.log(`Récupération des séries pour la séance ${id}...`);
            const setsResponse = await getSwimSetsForWorkout(id);
            const currentSets = setsResponse.data || [];
            console.log(`${currentSets.length} séries récupérées:`, currentSets);
            setCurrentWorkoutSets(currentSets);
            
            // Set the IDs of already associated sets
            setSelectedSets(currentSets.map(set => set.id));
          } catch (setsErr) {
            console.error(`Erreur lors de la récupération des séries pour la séance ${id}:`, setsErr);
            setError(`Erreur lors de la récupération des séries: ${setsErr.message}`);
          }
          
          // Fetch associated plans
          try {
            const plansResponse = await api.get(`/api/workouts/${id}/plans`);
            setCurrentWorkoutPlans(plansResponse.data || []);
            setSelectedPlans(plansResponse.data.map(plan => plan.id) || []);
          } catch (plansErr) {
            console.error(`Erreur lors de la récupération des plans pour la séance ${id}:`, plansErr);
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Erreur lors du chargement de la séance:', err);
          setError(`Erreur lors du chargement de la séance: ${err.response?.data?.message || err.message}`);
          setLoading(false);
        }
      }
    };
  
    fetchWorkout();
  }, [id, isEditMode]);

  /**
   * 🇬🇧 Load users, plans, and sets on component mount
   * 🇫🇷 Charger les utilisateurs, plans et séries au montage du composant
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Chargement des données associées (utilisateurs, séries, plans)...');
        
        // Fetch users
        const usersResponse = await getUsers();
        setUsers(usersResponse.data);
        
        // Fetch all swim sets
        try {
          const setsResponse = await getSwimSets();
          const setsData = setsResponse.data || [];
          console.log(`${setsData.length} séries récupérées au total`);
          
          // Enrich swim sets with exercise data
          const enrichedSets = await Promise.all(setsData.map(async (set) => {
            if (set.exercise_id) {
              try {
                const exerciseResponse = await getExercise(set.exercise_id);
                return {
                  ...set,
                  exerciseTitle: exerciseResponse.data.title,
                  totalDistance: (set.set_distance || 0) * (set.set_repetition || 1)
                };
              } catch (err) {
                console.error(`Erreur lors de la récupération de l'exercice ${set.exercise_id}:`, err);
                return {
                  ...set,
                  exerciseTitle: `Exercise #${set.exercise_id}`,
                  totalDistance: (set.set_distance || 0) * (set.set_repetition || 1)
                };
              }
            }
            return {
              ...set,
              exerciseTitle: 'Unknown Exercise',
              totalDistance: (set.set_distance || 0) * (set.set_repetition || 1)
            };
          }));
          
          setAllSets(enrichedSets);
        } catch (setsErr) {
          console.error('Erreur lors de la récupération des séries:', setsErr);
          setError(`Erreur lors de la récupération des séries: ${setsErr.message}`);
        }
        
        // Fetch all plans
        try {
          const plansResponse = await getPlans();
          setAllPlans(plansResponse.data || []);
        } catch (plansErr) {
          console.error('Erreur lors de la récupération des plans:', plansErr);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Erreur lors du chargement des données associées.");
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  /**
   * 🇬🇧 Load saved state from localStorage when returning from creating a new set
   * 🇫🇷 Charger l'état sauvegardé depuis localStorage lors du retour de la création d'une nouvelle série
   */
  useEffect(() => {
    const savedState = localStorage.getItem('workout_form_state');
    if (savedState && !isEditMode) {
      try {
        const state = JSON.parse(savedState);
        setFormData({
          title: state.title || '',
          description: state.description || '',
          workout_category: state.workout_category || '',
          user_id: state.user_id || ''
        });
        if (state.selectedSets) {
          setSelectedSets(state.selectedSets);
        }
        // Supprimer l'état sauvegardé après l'avoir chargé
        localStorage.removeItem('workout_form_state');
      } catch (err) {
        console.error('Erreur lors du chargement de l\'état sauvegardé:', err);
      }
    }
  }, [isEditMode]);

  /**
   * 🇬🇧 Handle form input changes
   * 🇫🇷 Gérer les changements dans les champs du formulaire
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * 🇬🇧 Handle description text editor changes
   * 🇫🇷 Gérer les changements dans l'éditeur de texte pour la description
   */
  const handleDescriptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
  };
  
  /**
   * 🇬🇧 Handle category selection
   * 🇫🇷 Gérer la sélection de catégorie
   */
  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      workout_category: prev.workout_category === category ? '' : category
    }));
  };
  
  /**
   * 🇬🇧 Handle set selection toggle
   * 🇫🇷 Gérer la sélection/désélection d'une série
   */
  const handleSetToggle = (setId) => {
    setSelectedSets(prev => {
      if (prev.includes(setId)) {
        return prev.filter(id => id !== setId);
      } else {
        return [...prev, setId];
      }
    });
  };
  
  /**
   * 🇬🇧 Handle plan selection toggle
   * 🇫🇷 Gérer la sélection/désélection d'un plan
   */
  const handlePlanToggle = (planId) => {
    setSelectedPlans(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      } else {
        return [...prev, planId];
      }
    });
  };

  /**
   * 🇬🇧 Format time in seconds to MM:SS
   * 🇫🇷 Formater le temps en secondes au format MM:SS
   */
  const formatRestTime = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * 🇬🇧 Calculate total workout distance based on selected sets
   * 🇫🇷 Calculer la distance totale de la séance en fonction des séries sélectionnées
   */
  const calculateTotalDistance = () => {
    if (!selectedSets.length) return 0;
    
    return allSets
      .filter(set => selectedSets.includes(set.id))
      .reduce((total, set) => total + ((set.set_distance || 0) * (set.set_repetition || 1)), 0);
  };

  /**
   * 🇬🇧 Request sort for sets
   * 🇫🇷 Demander un tri des séries
   */
  const requestSetsSort = (key) => {
    let direction = 'asc';
    if (setsSortConfig.key === key && setsSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSetsSortConfig({ key, direction });
    // Reset to first page when sorting
    setSetsCurrentPage(1);
  };

  /**
   * 🇬🇧 Request sort for plans
   * 🇫🇷 Demander un tri des plans
   */
  const requestPlansSort = (key) => {
    let direction = 'asc';
    if (plansSortConfig.key === key && plansSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setPlansSortConfig({ key, direction });
    // Reset to first page when sorting
    setPlansCurrentPage(1);
  };

  /**
   * 🇬🇧 Get sort direction icon
   * 🇫🇷 Obtenir l'icône de direction de tri
   */
  const getSortDirectionIcon = (key, sortConfig) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  /**
   * 🇬🇧 Handle form submission
   * 🇫🇷 Gérer la soumission du formulaire
   */
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
        workout_category: formData.workout_category || null,
        user_id: parseInt(formData.user_id)
      };
  
      let workoutId;
      
      if (isEditMode) {
        await updateWorkout(id, submitData);
        workoutId = id;
      } else {
        const response = await createWorkout(submitData);
        workoutId = response.data.id;
      }
      
      // Associate sets with workout
      if (selectedSets.length > 0) {
        // En mode édition, déterminez quelles séries doivent être ajoutées et lesquelles doivent être supprimées
        if (isEditMode) {
          const currentSetIds = currentWorkoutSets.map(set => set.id);
          const setsToAdd = selectedSets.filter(setId => !currentSetIds.includes(setId));
          const setsToRemove = currentSetIds.filter(setId => !selectedSets.includes(setId));
          
          // Ajouter les nouvelles séries
          for (const setId of setsToAdd) {
            try {
              await addSwimSetToWorkout(workoutId, setId);
              console.log(`Série ${setId} ajoutée avec succès à la séance ${workoutId}`);
            } catch (err) {
              console.error(`Erreur lors de l'association de la série ${setId}:`, err);
            }
          }
          
          // Supprimer les séries non sélectionnées
          for (const setId of setsToRemove) {
            try {
              await removeSwimSetFromWorkout(workoutId, setId);
              console.log(`Série ${setId} supprimée avec succès de la séance ${workoutId}`);
            } catch (err) {
              console.error(`Erreur lors de la suppression de la série ${setId}:`, err);
            }
          }
        } else {
          // En mode création, ajoutez simplement toutes les séries sélectionnées
          for (const setId of selectedSets) {
            try {
              await addSwimSetToWorkout(workoutId, setId);
              console.log(`Série ${setId} ajoutée avec succès à la séance ${workoutId}`);
            } catch (err) {
              console.error(`Erreur lors de l'association de la série ${setId}:`, err);
            }
          }
        }
      }
      
      // Associate plans with workout
      if (selectedPlans.length > 0) {
        await Promise.all(
          selectedPlans.map(async (planId) => {
            // Only add plans that aren't already associated
            if (!isEditMode || !currentWorkoutPlans.some(p => p.id === planId)) {
              try {
                await addWorkoutToPlan(planId, workoutId);
              } catch (err) {
                console.error(`Error associating plan ${planId}:`, err);
              }
            }
          })
        );
      }
  
      // Rediriger vers la liste des séances
      navigate('/admin/workouts');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(`Erreur lors de l'enregistrement: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Filter sets based on search term
  const filteredSets = allSets.filter(set => 
    set.exerciseTitle.toLowerCase().includes(setsSearchTerm.toLowerCase()) ||
    set.id.toString().includes(setsSearchTerm)
  );
  
  // Filter plans based on search term
  const filteredPlans = allPlans.filter(plan => 
    plan.title.toLowerCase().includes(plansSearchTerm.toLowerCase()) ||
    plan.id.toString().includes(plansSearchTerm)
  );

  // Sort sets
  const sortedSets = [...filteredSets].sort((a, b) => {
    if (a[setsSortConfig.key] < b[setsSortConfig.key]) {
      return setsSortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[setsSortConfig.key] > b[setsSortConfig.key]) {
      return setsSortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Sort plans
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (a[plansSortConfig.key] < b[plansSortConfig.key]) {
      return plansSortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[plansSortConfig.key] > b[plansSortConfig.key]) {
      return plansSortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Paginate sets
  const indexOfLastSet = setsCurrentPage * setsPerPage;
  const indexOfFirstSet = indexOfLastSet - setsPerPage;
  const currentSets = sortedSets.slice(indexOfFirstSet, indexOfLastSet);
  const totalSetsPages = Math.ceil(sortedSets.length / setsPerPage);

  // Paginate plans
  const indexOfLastPlan = plansCurrentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = sortedPlans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPlansPages = Math.ceil(sortedPlans.length / plansPerPage);

  /**
   * 🇬🇧 Handle pagination
   * 🇫🇷 Gérer la pagination
   */
  const paginate = (pageNumber, setPage) => setPage(pageNumber);

  /**
   * 🇬🇧 Render pagination controls
   * 🇫🇷 Afficher les contrôles de pagination
   */
  const renderPagination = (currentPage, totalPages, paginate, setPage) => {
    if (totalPages <= 1) return null;

    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button 
          className="btn btn-sm btn-outline-secondary" 
          onClick={() => paginate(currentPage - 1, setPage)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft /> Précédent
        </button>
        
        <div className="px-2">
          Page {currentPage} sur {totalPages}
        </div>
        
        <button 
          className="btn btn-sm btn-outline-secondary" 
          onClick={() => paginate(currentPage + 1, setPage)}
          disabled={currentPage === totalPages}
        >
          Suivant <FaChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <button 
        className="btn btn-outline-primary mb-4" 
        onClick={() => navigate('/admin/workouts')}
      >
        <FaArrowLeft className="me-2" /> Retour à la liste
      </button>

      <div className="card shadow mb-4">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">
            {isEditMode ? "Modifier la séance" : "Créer une nouvelle séance"}
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

              {/* Catégorie - Boutons à cocher */}
              <div className="mb-4">
                <label className="form-label d-block">Catégorie</label>
                <div className="d-flex flex-wrap gap-2">
                  {workoutCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`btn ${formData.workout_category === category ? 'btn-primary' : 'btn-outline-primary'}`}
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
              
              {/* Séries associées */}
              <div className="card mb-4">
                <div className="card-header bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <FaSwimmer className="me-2 text-primary" /> 
                      Séries associées
                      {selectedSets.length > 0 && (
                        <span className="badge bg-primary ms-2">{selectedSets.length}</span>
                      )}
                    </h6>
                    {selectedSets.length > 0 && (
                      <div className="text-end">
                        <span className="text-primary fw-bold">
                          Total: {calculateTotalDistance()} m
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-body">
                  <div className="row mb-3 align-items-center">
                    <div className="col-md-8">
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaSearch />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Rechercher une série..."
                          value={setsSearchTerm}
                          onChange={(e) => {
                            setSetsSearchTerm(e.target.value);
                            setSetsCurrentPage(1); // Reset to page 1 on search
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex align-items-center">
                        <span className="me-2">Afficher</span>
                        <select 
                          className="form-select form-select-sm" 
                          value={setsPerPage}
                          onChange={(e) => {
                            setSetsPerPage(Number(e.target.value));
                            setSetsCurrentPage(1); // Reset to page 1 when changing items per page
                          }}
                          style={{width: '70px'}}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="20">20</option>
                        </select>
                        <span className="ms-2">par page</span>
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                      </div>
                    </div>
                  ) : allSets.length === 0 ? (
                    <div className="alert alert-info">
                      <FaInfoCircle className="me-2" />
                      Aucune série disponible. Veuillez d'abord créer des séries.
                      <div className="mt-2">
                        <button 
                          type="button"
                          className="btn btn-primary btn-sm" 
                          onClick={() => navigate('/admin/swim-sets/new')}
                        >
                          <FaPlus className="me-1" /> Créer une série
                        </button>
                      </div>
                    </div>
                  ) : filteredSets.length === 0 ? (
                    <div className="alert alert-warning">
                      <FaInfoCircle className="me-2" />
                      Aucune série ne correspond à votre recherche.
                    </div>
                  ) : (
                    <>
                      {/* Afficher un message si des séries sont sélectionnées */}
                      {selectedSets.length > 0 && (
                        <div className="alert alert-success mb-3">
                          <FaRegCheckSquare className="me-2" />
                          {selectedSets.length} {selectedSets.length === 1 ? 'série sélectionnée' : 'séries sélectionnées'}
                          {/* Bouton pour désélectionner toutes les séries */}
                          <button 
                            type="button"
                            className="btn btn-sm btn-outline-secondary float-end"
                            onClick={() => setSelectedSets([])}
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
                                onClick={() => requestSetsSort('id')}
                                className="d-flex align-items-center"
                              >
                                ID {getSortDirectionIcon('id', setsSortConfig)}
                              </th>
                              <th 
                                style={{cursor: 'pointer'}}
                                onClick={() => requestSetsSort('exerciseTitle')}
                                className="d-flex align-items-center"
                              >
                                Exercice {getSortDirectionIcon('exerciseTitle', setsSortConfig)}
                              </th>
                              <th 
                                className="text-center" 
                                style={{cursor: 'pointer'}}
                                onClick={() => requestSetsSort('set_repetition')}
                              >
                                Répétitions {getSortDirectionIcon('set_repetition', setsSortConfig)}
                              </th>
                              <th 
                                className="text-center"
                                style={{cursor: 'pointer'}}
                                onClick={() => requestSetsSort('set_distance')}
                              >
                                Distance {getSortDirectionIcon('set_distance', setsSortConfig)}
                              </th>
                              <th 
                                className="text-center"
                                style={{cursor: 'pointer'}}
                                onClick={() => requestSetsSort('rest_time')}
                              >
                                Repos {getSortDirectionIcon('rest_time', setsSortConfig)}
                              </th>
                              <th 
                                className="text-center"
                                style={{cursor: 'pointer'}}
                                onClick={() => requestSetsSort('totalDistance')}
                              >
                                Total {getSortDirectionIcon('totalDistance', setsSortConfig)}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentSets.map((set) => (
                              <tr 
                                key={set.id}
                                onClick={() => handleSetToggle(set.id)}
                                style={{cursor: 'pointer'}}
                                className={selectedSets.includes(set.id) ? 'table-primary' : ''}
                              >
                                <td className="text-center">
                                  {selectedSets.includes(set.id) ? (
                                    <FaRegCheckSquare className="text-primary" />
                                  ) : (
                                    <FaRegSquare className="text-muted" />
                                  )}
                                </td>
                                <td>{set.id}</td>
                                <td>{set.exerciseTitle}</td>
                                <td className="text-center">x{set.set_repetition || 1}</td>
                                <td className="text-center">{set.set_distance} m</td>
                                <td className="text-center">{formatRestTime(set.rest_time)}</td>
                                <td className="text-center fw-bold">
                                  {set.totalDistance} m
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination pour les séries */}
                      {renderPagination(setsCurrentPage, totalSetsPages, paginate, setSetsCurrentPage)}
                    </>
                  )}

                  {/* Bouton pour ajouter une nouvelle série */}
                  <div className="d-flex justify-content-end mt-3">
                    <button 
                      type="button"
                      className="btn btn-outline-success" 
                      onClick={() => {
                        // Sauvegarder l'état actuel dans localStorage pour y revenir après
                        const currentState = {
                          title: formData.title,
                          description: formData.description,
                          workout_category: formData.workout_category,
                          user_id: formData.user_id,
                          selectedSets: selectedSets
                        };
                        localStorage.setItem('workout_form_state', JSON.stringify(currentState));
                        navigate('/admin/swim-sets/new');
                      }}
                    >
                      <FaPlus className="me-1" /> Créer une nouvelle série
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Plans associés */}
              <div className="card mb-4">
                <div className="card-header bg-white">
                  <h6 className="mb-0">
                    <FaCalendarAlt className="me-2 text-primary" /> 
                    Plans associés
                    {selectedPlans.length > 0 && (
                      <span className="badge bg-primary ms-2">{selectedPlans.length}</span>
                    )}
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row mb-3 align-items-center">
                    <div className="col-md-8">
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaSearch />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Rechercher un plan..."
                          value={plansSearchTerm}
                          onChange={(e) => {
                            setPlansSearchTerm(e.target.value);
                            setPlansCurrentPage(1); // Reset to page 1 on search
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex align-items-center">
                        <span className="me-2">Afficher</span>
                        <select 
                          className="form-select form-select-sm" 
                          value={plansPerPage}
                          onChange={(e) => {
                            setPlansPerPage(Number(e.target.value));
                            setPlansCurrentPage(1); // Reset to page 1 when changing items per page
                          }}
                          style={{width: '70px'}}
                        >
                          <option value="6">6</option>
                          <option value="12">12</option>
                          <option value="18">18</option>
                          <option value="24">24</option>
                        </select>
                        <span className="ms-2">par page</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Affichage des plans */}
                  {allPlans.length === 0 ? (
                    <div className="alert alert-info">
                      <FaInfoCircle className="me-2" />
                      Aucun plan disponible. Veuillez d'abord créer des plans.
                      <div className="mt-2">
                        <button 
                          type="button"
                          className="btn btn-primary btn-sm" 
                          onClick={() => navigate('/admin/plans/new')}
                        >
                          <FaPlus className="me-1" /> Créer un plan
                        </button>
                      </div>
                    </div>
                  ) : filteredPlans.length === 0 ? (
                    <div className="alert alert-warning">
                      <FaInfoCircle className="me-2" />
                      Aucun plan ne correspond à votre recherche.
                    </div>
                  ) : (
                    <>
                      {/* Afficher un message si des plans sont sélectionnés */}
                      {selectedPlans.length > 0 && (
                        <div className="alert alert-success mb-3">
                          <FaRegCheckSquare className="me-2" />
                          {selectedPlans.length} {selectedPlans.length === 1 ? 'plan sélectionné' : 'plans sélectionnés'}
                          {/* Bouton pour désélectionner tous les plans */}
                          <button 
                            type="button"
                            className="btn btn-sm btn-outline-secondary float-end"
                            onClick={() => setSelectedPlans([])}
                          >
                            Tout désélectionner
                          </button>
                        </div>
                      )}

                      {/* Options de tri */}
                      <div className="mb-3">
                        <div className="btn-group btn-group-sm" role="group" aria-label="Tri des plans">
                          <button 
                            type="button" 
                            className={`btn ${plansSortConfig.key === 'id' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => requestPlansSort('id')}
                          >
                            ID {plansSortConfig.key === 'id' && (plansSortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                          </button>
                          <button 
                            type="button" 
                            className={`btn ${plansSortConfig.key === 'title' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => requestPlansSort('title')}
                          >
                            Titre {plansSortConfig.key === 'title' && (plansSortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                          </button>
                          <button 
                            type="button" 
                            className={`btn ${plansSortConfig.key === 'plan_category' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => requestPlansSort('plan_category')}
                          >
                            Catégorie {plansSortConfig.key === 'plan_category' && (plansSortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                          </button>
                        </div>
                      </div>

                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                        {currentPlans.map((plan) => (
                          <div key={plan.id} className="col">
                            <div 
                              className={`card h-100 ${selectedPlans.includes(plan.id) ? 'border-primary' : ''}`}
                              onClick={() => handlePlanToggle(plan.id)}
                              style={{cursor: 'pointer'}}
                            >
                              <div className="card-body">
                                <div className="d-flex align-items-center mb-2">
                                  {selectedPlans.includes(plan.id) ? (
                                    <FaRegCheckSquare className="text-primary me-2" />
                                  ) : (
                                    <FaRegSquare className="text-muted me-2" />
                                  )}
                                  <h6 className="card-title mb-0">{plan.title}</h6>
                                </div>
                                <div className="mt-2">
                                  {plan.plan_category && (
                                    <span className="badge bg-info bg-opacity-10 text-info me-1">
                                      {plan.plan_category}
                                    </span>
                                  )}
                                  {plan.plan_level && (
                                    <span className="badge bg-secondary ms-1">
                                      {plan.plan_level}
                                    </span>
                                  )}
                                </div>
                                {plan.description && (
                                  <p className="card-text small text-muted mt-2">
                                    {plan.description.length > 60 
                                      ? plan.description.substring(0, 60) + '...' 
                                      : plan.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination pour les plans */}
                      {renderPagination(plansCurrentPage, totalPlansPages, paginate, setPlansCurrentPage)}
                    </>
                  )}
                </div>
              </div>

              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" /> Enregistrer
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

export default WorkoutFormPage;