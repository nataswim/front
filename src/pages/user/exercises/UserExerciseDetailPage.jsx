import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaDumbbell
} from 'react-icons/fa';
import { getExercise, getExercises } from '../../../services/exercises';
import { getUpload } from '../../../services/uploads';

/**
 * 🇬🇧 Exercise detail page component
 * This component displays detailed information about a specific exercise
 * 
 * 🇫🇷 Composant de page de détail d'exercice
 * Ce composant affiche les informations détaillées d'un exercice spécifique
 */
const ExerciseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // États
  const [exercise, setExercise] = useState(null);
  const [mediaImage, setMediaImage] = useState(null);
  const [relatedExercises, setRelatedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true);
        // Récupérer les détails de l'exercice
        const exerciseResponse = await getExercise(id);
        setExercise(exerciseResponse.data);

        // Si l'exercice a un upload_id, récupérer l'image
        if (exerciseResponse.data.upload_id) {
          try {
            const imageResponse = await getUpload(exerciseResponse.data.upload_id);
            setMediaImage(imageResponse.data);
          } catch (imageError) {
            console.error('Erreur lors du chargement du média associé:', imageError);
          }
        }

        // Récupérer les exercices les plus récents
        try {
          const allExercisesResponse = await getExercises();
          if (allExercisesResponse.data) {
            // Filtrer pour exclure l'exercice actuel
            const otherExercises = allExercisesResponse.data
              .filter(ex => ex.id !== parseInt(id))
              // Trier par date (du plus récent au plus ancien)
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              // Prendre les 12 premiers
              .slice(0, 12);
            
            // Récupérer les images pour ces exercices
            const exercisesWithImages = await Promise.all(
              otherExercises.map(async (ex) => {
                if (ex.upload_id) {
                  try {
                    const imgResponse = await getUpload(ex.upload_id);
                    return { ...ex, imageUrl: imgResponse.data.url };
                  } catch (err) {
                    return { ...ex, imageUrl: null };
                  }
                }
                return { ...ex, imageUrl: null };
              })
            );
            
            setRelatedExercises(exercisesWithImages);
          }
        } catch (relatedError) {
          console.error('Erreur lors du chargement des exercices liés:', relatedError);
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
          onClick={() => navigate('/user/exercises')}
        >
          <FaArrowLeft className="me-2" /> Retour aux exercices
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
          onClick={() => navigate('/user/exercises')}
        >
          <FaArrowLeft className="me-2" /> Tous les exercices
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Bouton de retour */}
      <div className="mb-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/user/exercises')}
        >
          <FaArrowLeft className="me-2" /> Tous les exercices
        </button>
      </div>

      <div className="card shadow-sm mb-5">
        <div className="card-body">
          {/* Image d'exercice en premier */}
          {mediaImage && (
            <div className="text-center mb-4">
              <img 
                src={mediaImage.url} 
                alt={exercise.title}
                className="img-fluid rounded"
                style={{ maxHeight: '300px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/400x300?text=Image+non+disponible';
                }}
              />
            </div>
          )}

          {/* Titre et badges */}
          <div className="text-center mb-4">
            <h1 className="h3 mb-3">{exercise.title}</h1>
            <div className="d-flex justify-content-center gap-3">
              {exercise.exercise_level && (
                <span className={`badge bg-${
                  exercise.exercise_level === 'Débutant' ? 'success' :
                  exercise.exercise_level === 'Intermédiaire' ? 'warning' :
                  exercise.exercise_level === 'Avancé' ? 'danger' :
                  'secondary'
                }`}>
                  {exercise.exercise_level}
                </span>
              )}
              {exercise.exercise_category && (
                <span className="badge bg-info">
                  {exercise.exercise_category}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="card bg-light">
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
        </div>
      </div>

      {/* Autres exercices */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h2 className="h5 mb-0">
            <FaDumbbell className="text-primary me-2" />
            Autres exercices qui pourraient vous intéresser
          </h2>
        </div>
        <div className="card-body">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {relatedExercises.length > 0 ? (
              relatedExercises.map(relatedExercise => (
                <div key={relatedExercise.id} className="col">
                  <div className="card h-100 hover-lift">
                    <div className="card-body text-center">
                      {relatedExercise.imageUrl ? (
                        <img 
                          src={relatedExercise.imageUrl} 
                          alt={relatedExercise.title}
                          className="img-fluid rounded mb-3"
                          style={{ height: '120px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/200x120?text=Exercice';
                          }}
                        />
                      ) : (
                        <div className="bg-light rounded mb-3 d-flex justify-content-center align-items-center" style={{ height: '120px' }}>
                          <FaDumbbell size={36} className="text-primary" />
                        </div>
                      )}
                      <h3 className="h6 mb-0">{relatedExercise.title}</h3>
                    </div>
                    <div className="card-footer bg-white border-top-0">
                      <Link 
                        to={`/user/exercises/${relatedExercise.id}`}
                        className="btn btn-outline-primary btn-sm w-100"
                      >
                        Voir l'exercice
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-muted text-center">Aucun autre exercice disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;