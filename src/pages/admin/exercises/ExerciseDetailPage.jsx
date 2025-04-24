import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaUser, 
  FaCalendarAlt, 
  FaImage, 
  FaSwimmer,
  FaDumbbell,
  FaClock,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { getExercise } from '../../../services/exercises';
import { getUpload } from '../../../services/uploads';

const ExerciseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [mediaImage, setMediaImage] = useState(null);
  const [relatedWorkouts, setRelatedWorkouts] = useState([]);
  const [relatedSets, setRelatedSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true);
        // Fetch exercise details
        const exerciseResponse = await getExercise(id);
        setExercise(exerciseResponse.data);

        // If exercise has an upload_id, fetch the image
        if (exerciseResponse.data.upload_id) {
          try {
            const imageResponse = await getUpload(exerciseResponse.data.upload_id);
            setMediaImage(imageResponse.data);
          } catch (imageError) {
            console.error('Erreur lors du chargement du média associé:', imageError);
          }
        }

        // Fetch related workouts
        try {
          const workoutsResponse = await fetch(`http://127.0.0.1:8000/api/exercises/${id}/workouts`);
          if (workoutsResponse.ok) {
            const workoutsData = await workoutsResponse.json();
            setRelatedWorkouts(workoutsData);
          }
        } catch (workoutsError) {
          console.error('Erreur lors du chargement des séances associées:', workoutsError);
        }

        // Fetch related swim sets
        try {
          const setsResponse = await fetch(`http://127.0.0.1:8000/api/exercises/${id}/swim-sets`);
          if (setsResponse.ok) {
            const setsData = await setsResponse.json();
            setRelatedSets(setsData);
          }
        } catch (setsError) {
          console.error('Erreur lors du chargement des séries associées:', setsError);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, [id]);

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

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => navigate('/admin/exercises')}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          Exercice non trouvé
        </div>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => navigate('/admin/exercises')}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-primary me-3"
                onClick={() => navigate('/admin/exercises')}
              >
                <FaArrowLeft className="me-2" /> Retour
              </button>
              <h1 className="h4 mb-0">{exercise.title}</h1>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/admin/exercises/${id}/edit`)}
            >
              <FaEdit className="me-2" /> Modifier
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-body">
                  <h2 className="h5 mb-3">Description</h2>
                  {exercise.description ? (
                    <div 
                      className="description-content"
                      dangerouslySetInnerHTML={{ __html: exercise.description }}
                    />
                  ) : (
                    <p className="text-muted">Aucune description disponible</p>
                  )}
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h2 className="h5 mb-3">Niveau</h2>
                      <span className={`badge bg-${
                        exercise.exercise_level === 'Débutant' ? 'success' :
                        exercise.exercise_level === 'Intermédiaire' ? 'warning' :
                        exercise.exercise_level === 'Avancé' ? 'danger' :
                        'secondary'
                      }`}>
                        {exercise.exercise_level || "Non défini"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h2 className="h5 mb-3">Catégorie</h2>
                      <span className="badge bg-info">
                        {exercise.exercise_category || "Non catégorisé"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h2 className="h5 mb-3">Informations</h2>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <FaUser className="text-primary me-2" />
                      Créé par: User #{exercise.user_id}
                    </li>
                    <li className="mb-2">
                      <FaCalendarAlt className="text-primary me-2" />
                      Créé le: {new Date(exercise.created_at).toLocaleDateString()}
                    </li>
                    {exercise.updated_at && (
                      <li>
                        <FaCalendarAlt className="text-primary me-2" />
                        Dernière modification: {new Date(exercise.updated_at).toLocaleDateString()}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Séances associées */}
          <div className="card mt-4">
            <div className="card-header bg-white">
              <h2 className="h5 mb-0">
                <FaSwimmer className="text-primary me-2" />
                Séances associées ({relatedWorkouts.length})
              </h2>
            </div>
            <div className="card-body">
              {relatedWorkouts.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Titre</th>
                        <th>Niveau</th>
                        <th>Durée</th>
                        <th>Date de création</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedWorkouts.map(workout => (
                        <tr key={workout.id}>
                          <td>{workout.id}</td>
                          <td>{workout.title}</td>
                          <td>
                            <span className={`badge bg-${
                              workout.workout_level === 'Débutant' ? 'success' :
                              workout.workout_level === 'Intermédiaire' ? 'warning' :
                              workout.workout_level === 'Avancé' ? 'danger' :
                              'secondary'
                            }`}>
                              {workout.workout_level || "Non défini"}
                            </span>
                          </td>
                          <td>{workout.duration || "N/A"} min</td>
                          <td>{new Date(workout.created_at).toLocaleDateString()}</td>
                          <td>
                            <Link 
                              to={`/admin/workouts/${workout.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <FaExternalLinkAlt className="me-1" /> Voir
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">Aucune séance associée à cet exercice.</p>
              )}
            </div>
          </div>

          {/* Séries associées */}
          <div className="card mt-4">
            <div className="card-header bg-white">
              <h2 className="h5 mb-0">
                <FaDumbbell className="text-primary me-2" />
                Séries de natation associées ({relatedSets.length})
              </h2>
            </div>
            <div className="card-body">
              {relatedSets.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Titre</th>
                        <th>Distance</th>
                        <th>Répétitions</th>
                        <th>Style</th>
                        <th>Durée</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedSets.map(set => (
                        <tr key={set.id}>
                          <td>{set.id}</td>
                          <td>{set.title || "Sans titre"}</td>
                          <td>{set.distance || "N/A"} m</td>
                          <td>{set.repetitions || 1}</td>
                          <td>{set.swim_style || "Non spécifié"}</td>
                          <td>
                            <FaClock className="me-1" />
                            {set.duration || "N/A"} sec
                          </td>
                          <td>
                            <Link 
                              to={`/admin/swim-sets/${set.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <FaExternalLinkAlt className="me-1" /> Voir
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">Aucune série de natation associée à cet exercice.</p>
              )}
            </div>
          </div>

          {/* Média associé */}
          {mediaImage && (
            <div className="card mt-4">
              <div className="card-header bg-white">
                <h2 className="h5 mb-0">
                  <FaImage className="text-primary me-2" />
                  Média associé
                </h2>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-body">
                        <img 
                          src={mediaImage.url} 
                          alt={mediaImage.filename}
                          className="img-fluid rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/400x300?text=Image+non+disponible';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <h3 className="h6 mb-3">Détails du fichier</h3>
                    <dl className="row">
                      <dt className="col-sm-3">Nom</dt>
                      <dd className="col-sm-9">{mediaImage.filename}</dd>
                      
                      <dt className="col-sm-3">Type</dt>
                      <dd className="col-sm-9">{mediaImage.type || "Non spécifié"}</dd>
                      
                      <dt className="col-sm-3">ID</dt>
                      <dd className="col-sm-9">{mediaImage.id}</dd>
                      
                      <dt className="col-sm-3">Actions</dt>
                      <dd className="col-sm-9">
                        <a 
                          href={mediaImage.url} 
                          className="btn btn-sm btn-outline-primary"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Voir en plein écran
                        </a>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;