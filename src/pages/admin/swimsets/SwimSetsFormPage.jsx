import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaSwimmer, 
  FaRunning, 
  FaStopwatch, 
  FaRedoAlt 
} from 'react-icons/fa';
import { getSwimSet, createSwimSet, updateSwimSet } from '../../../services/swimsets';
import { getWorkouts } from '../../../services/workouts';
import { getExercises } from '../../../services/exercises';
import { API_ENDPOINTS, API_BASE_URL } from '../../../config/api.config';
import api from '../../../services/api';

/**
 * 🇬🇧 Component for creating and editing swim sets
 * 🇫🇷 Composant pour créer et modifier des séries de natation
 */
const SwimSetsFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    workout_id: '',
    exercise_id: '',
    set_distance: '',
    set_repetition: '',
    rest_time: ''
  });

  // Status states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Preset values for common distances and repetitions
  const commonDistances = [25, 50, 100, 200, 400, 800];
  const commonRepetitions = [1, 2, 4, 6, 8, 10];
  const commonRestTimes = [15, 30, 45, 60, 90, 120];

  /**
   * 🇬🇧 Load swim set data if in edit mode
   * 🇫🇷 Charger les données de la série si en mode édition
   */
  useEffect(() => {
    const fetchSwimSet = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          console.log(`Chargement de la série ${id}...`);
          const response = await getSwimSet(id);
          const swimSetData = response.data;
          
          setFormData({
            workout_id: swimSetData.workout_id ? swimSetData.workout_id.toString() : '',
            exercise_id: swimSetData.exercise_id ? swimSetData.exercise_id.toString() : '',
            set_distance: swimSetData.set_distance ? swimSetData.set_distance.toString() : '',
            set_repetition: swimSetData.set_repetition ? swimSetData.set_repetition.toString() : '',
            rest_time: swimSetData.rest_time ? swimSetData.rest_time.toString() : ''
          });
          
          console.log("Données de série chargées:", swimSetData);
          setLoading(false);
        } catch (err) {
          console.error('Erreur lors du chargement de la série:', err);
          setError(`Erreur lors du chargement de la série: ${err.response?.data?.message || err.message}`);
          setLoading(false);
        }
      }
    };

    fetchSwimSet();
  }, [id, isEditMode]);

  /**
   * 🇬🇧 Load workouts and exercises
   * 🇫🇷 Charger les séances et les exercices
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Chargement des séances et exercices...');
        
        // Utiliser les services API au lieu de fetch directement
        const [workoutsResponse, exercisesResponse] = await Promise.all([
          api.get(API_ENDPOINTS.WORKOUTS),
          api.get(API_ENDPOINTS.EXERCISES)
        ]);

        const workoutsData = workoutsResponse.data;
const exercisesData = exercisesResponse.data;

        console.log(`${workoutsData.length} séances chargées`);
        console.log(`${exercisesData.length} exercices chargés`);
        
        setWorkouts(workoutsData);
        setExercises(exercisesData);

        // Update selected workout and exercise if we have their IDs
        if (formData.workout_id) {
          const workout = workoutsData.find(w => w.id === parseInt(formData.workout_id));
          setSelectedWorkout(workout);
          console.log("Séance sélectionnée:", workout);
        }
        
        if (formData.exercise_id) {
          const exercise = exercisesData.find(e => e.id === parseInt(formData.exercise_id));
          setSelectedExercise(exercise);
          console.log("Exercice sélectionné:", exercise);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(`Erreur lors du chargement des séances et exercices: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [formData.workout_id, formData.exercise_id]);

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

    // Update selected items
    if (name === 'workout_id') {
      const workout = workouts.find(w => w.id === parseInt(value));
      setSelectedWorkout(workout);
      console.log("Nouvelle séance sélectionnée:", workout);
    } else if (name === 'exercise_id') {
      const exercise = exercises.find(e => e.id === parseInt(value));
      setSelectedExercise(exercise);
      console.log("Nouvel exercice sélectionné:", exercise);
    }
  };

  /**
   * 🇬🇧 Handle quick selection for common values
   * 🇫🇷 Gérer la sélection rapide pour les valeurs courantes
   */
  const handleQuickSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.toString()
    }));
  };

  /**
   * 🇬🇧 Handle form submission
   * 🇫🇷 Gérer la soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.workout_id || !formData.exercise_id || !formData.set_distance) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      console.log("Enregistrement des données...");

      // Préparer les données à envoyer
      const submitData = {
        workout_id: parseInt(formData.workout_id),
        exercise_id: parseInt(formData.exercise_id),
        set_distance: parseInt(formData.set_distance),
        set_repetition: formData.set_repetition ? parseInt(formData.set_repetition) : null,
        rest_time: formData.rest_time ? parseInt(formData.rest_time) : null
      };

      console.log("Données à envoyer:", submitData);

      if (isEditMode) {
        await updateSwimSet(id, submitData);
        console.log(`Série ${id} mise à jour avec succès`);
      } else {
        const response = await createSwimSet(submitData);
        console.log(`Nouvelle série créée avec l'ID ${response.data.id}`);
      }

      // Rediriger vers la liste des séries
      navigate('/admin/swim-sets');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(`Erreur lors de l'enregistrement: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  /**
   * 🇬🇧 Format time for display
   * 🇫🇷 Formater le temps pour l'affichage
   */
  const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * 🇬🇧 Calculate total distance
   * 🇫🇷 Calculer la distance totale
   */
  const calculateTotalDistance = () => {
    const distance = parseInt(formData.set_distance) || 0;
    const repetition = parseInt(formData.set_repetition) || 1;
    return distance * repetition;
  };

  return (
    <div className="container py-4">
      <button 
        className="btn btn-outline-primary mb-4" 
        onClick={() => navigate('/admin/swim-sets')}
      >
        <FaArrowLeft className="me-2" /> Retour à la liste
      </button>

      <div className="card shadow">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">
            {isEditMode ? "Modifier la série" : "Créer une nouvelle série"}
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

              <div className="mb-4">
                <label htmlFor="workout_id" className="form-label">Séance d'entraînement</label>
                <select
                  className="form-select"
                  id="workout_id"
                  name="workout_id"
                  value={formData.workout_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner une séance</option>
                  {workouts.length > 0 ? (
                    workouts.map((workout) => (
                      <option key={workout.id} value={workout.id}>
                        {workout.title}
                      </option>
                    ))
                  ) : (
                    <option disabled>Chargement des séances...</option>
                  )}
                </select>
                
                {selectedWorkout && (
                  <div className="mt-2 p-2 bg-light rounded">
                    <p className="text-muted small mb-1">
                      {selectedWorkout.description ? 
                        selectedWorkout.description : 
                        "Aucune description disponible"
                      }
                    </p>
                    {selectedWorkout.workout_category && (
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        <FaRunning className="me-1" /> {selectedWorkout.workout_category}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="exercise_id" className="form-label">Exercice</label>
                <select
                  className="form-select"
                  id="exercise_id"
                  name="exercise_id"
                  value={formData.exercise_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner un exercice</option>
                  {exercises.length > 0 ? (
                    exercises.map((exercise) => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.title}
                      </option>
                    ))
                  ) : (
                    <option disabled>Chargement des exercices...</option>
                  )}
                </select>
                
                {selectedExercise && (
                  <div className="mt-2 p-2 bg-light rounded">
                    <p className="text-muted small mb-1">
                      {selectedExercise.description ? 
                        selectedExercise.description : 
                        "Aucune description disponible"
                      }
                    </p>
                    <div>
                      {selectedExercise.exercise_level && (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary me-2">
                          {selectedExercise.exercise_level}
                        </span>
                      )}
                      {selectedExercise.exercise_category && (
                        <span className="badge bg-info bg-opacity-10 text-info">
                          <FaSwimmer className="me-1" /> {selectedExercise.exercise_category}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">
                    <FaSwimmer className="me-2" /> Distance
                  </h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="set_distance" className="form-label">Distance (mètres)</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        id="set_distance"
                        name="set_distance"
                        value={formData.set_distance}
                        onChange={handleChange}
                        required
                        min="1"
                      />
                      <span className="input-group-text">m</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="mb-2">Distances courantes:</p>
                    <div className="d-flex flex-wrap gap-2">
                      {commonDistances.map((distance) => (
                        <button
                          key={distance}
                          type="button"
                          className={`btn ${formData.set_distance === distance.toString() ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                          onClick={() => handleQuickSelect('set_distance', distance)}
                        >
                          {distance}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <FaRedoAlt className="me-2" /> Répétitions
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label htmlFor="set_repetition" className="form-label">Nombre de répétitions</label>
                        <input
                          type="number"
                          className="form-control"
                          id="set_repetition"
                          name="set_repetition"
                          value={formData.set_repetition}
                          onChange={handleChange}
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <p className="mb-2">Répétitions courantes:</p>
                        <div className="d-flex flex-wrap gap-2">
                          {commonRepetitions.map((rep) => (
                            <button
                              key={rep}
                              type="button"
                              className={`btn ${formData.set_repetition === rep.toString() ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                              onClick={() => handleQuickSelect('set_repetition', rep)}
                            >
                              {rep}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <FaStopwatch className="me-2" /> Temps de repos
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label htmlFor="rest_time" className="form-label">Temps de repos (secondes)</label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            id="rest_time"
                            name="rest_time"
                            value={formData.rest_time}
                            onChange={handleChange}
                            min="0"
                          />
                          <span className="input-group-text">sec</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="mb-2">Temps de repos courants:</p>
                        <div className="d-flex flex-wrap gap-2">
                          {commonRestTimes.map((time) => (
                            <button
                              key={time}
                              type="button"
                              className={`btn ${formData.rest_time === time.toString() ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                              onClick={() => handleQuickSelect('rest_time', time)}
                            >
                              {time}s
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Résumé */}
              <div className="card bg-light mb-4">
                <div className="card-body">
                  <h6 className="card-title">Résumé de la série</h6>
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <span className="text-muted">Distance par répétition:</span>
                      <p className="fw-medium mb-0">{formData.set_distance || 0} m</p>
                    </div>
                    <div className="col-md-4 mb-2">
                      <span className="text-muted">Nombre de répétitions:</span>
                      <p className="fw-medium mb-0">{formData.set_repetition || 1} ×</p>
                    </div>
                    <div className="col-md-4 mb-2">
                      <span className="text-muted">Temps de repos:</span>
                      <p className="fw-medium mb-0">{formatTime(formData.rest_time)}</p>
                    </div>
                    <div className="col-12 mt-2">
                      <hr className="my-2" />
                      <span className="text-muted">Distance totale:</span>
                      <p className="h4 text-primary fw-bold mb-0">{calculateTotalDistance()} m</p>
                    </div>
                  </div>
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

export default SwimSetsFormPage;