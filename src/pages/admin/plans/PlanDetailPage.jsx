import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSwimmer, 
  FaCalendarAlt, 
  FaUser, 
  FaList, 
  FaEye,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaClock
} from 'react-icons/fa';
import { getPlan, getPlans } from '../../../services/plans';
import { getWorkoutsForPlan, removeWorkoutFromPlan } from '../../../services/planWorkouts';

/**
 * 🇬🇧 Detail page for viewing a training plan
 * 🇫🇷 Page de détail pour visualiser un plan d'entraînement
 */
const PlanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [recentPlans, setRecentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentPlansLoading, setRecentPlansLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        // Fetch plan details
        const planResponse = await getPlan(id);
        setPlan(planResponse.data);

        // Fetch workouts for this plan
        const workoutsResponse = await getWorkoutsForPlan(id);
        const workoutsData = workoutsResponse.data;
        setWorkouts(workoutsData);

        setError(null);
      } catch (err) {
        console.error('Error fetching plan data:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentPlans = async () => {
      try {
        setRecentPlansLoading(true);
        const response = await getPlans();
        // Sort plans by creation date (most recent first) and filter out the current plan
        const sortedPlans = response.data
          .filter(p => p.id !== parseInt(id))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4);  // Get only the 4 most recent plans
        
        setRecentPlans(sortedPlans);
      } catch (err) {
        console.error('Error fetching recent plans:', err);
        // Don't set an error message for recent plans as it's not critical
      } finally {
        setRecentPlansLoading(false);
      }
    };

    fetchPlanData();
    fetchRecentPlans();
  }, [id]);

  const handleRemoveWorkout = async (workoutId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer cette séance du plan ?')) {
      return;
    }

    try {
      await removeWorkoutFromPlan(id, workoutId);
      
      // Update the workouts list
      const updatedWorkouts = workouts.filter(workout => workout.id !== workoutId);
      setWorkouts(updatedWorkouts);
    } catch (err) {
      setError('Erreur lors de la suppression de la séance: ' + err.message);
    }
  };

  // Get category badge color
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Débutant': return 'success';
      case 'Intermédiaire': return 'warning';
      case 'Avancé': return 'danger';
      default: return 'secondary';
    }
  };

  // Format date relative to now
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Strip HTML tags
  const stripHtml = (html) => {
    if (!html) return '';
    
    // Create a temporary element
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Return the text content
    return temp.textContent || temp.innerText || '';
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement des détails du plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <FaInfoCircle className="me-2" />
          {error}
        </div>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => navigate('/admin/plans')}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          <FaInfoCircle className="me-2" />
          Plan non trouvé
        </div>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => navigate('/admin/plans')}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Titre Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary-subtle">
              <h2 className="card-title mb-0">
                <FaCalendarAlt className="me-2" />
                Détails du Plan
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-success btn-lg d-flex align-items-center"
          onClick={() => navigate('/admin/plans')}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
        <div>
          <button
            className="btn btn-success btn-lg d-flex align-items-center"
            onClick={() => navigate(`/admin/plans/${id}/edit`)}
          >
            <FaEdit className="me-2" /> Modifier
          </button>
        </div>
      </div>
      
      {/* Titre et catégorie dans une carte séparée */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h2 className="h5 mb-0">Titre</h2>
        </div>
        <div className="card-body text-center py-4">
          <h1 className="h3 mb-3">{plan.title}</h1>
          {plan.plan_category && (
            <span className={`badge bg-${getCategoryBadgeColor(plan.plan_category)} px-3 py-2`}>
              {plan.plan_category}
            </span>
          )}
        </div>
      </div>
      
{/* Séances d'entraînement dans une carte séparée */}
<div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="h5 mb-0">
              <FaSwimmer className="me-2 text-primary" />
              Séances d'entraînement
            </h2>
            <button
              className="btn btn-primary btn-lg d-flex align-items-center"
              onClick={() => navigate(`/admin/plans/${id}/edit`)}
            >
              <FaPlus className="me-2" /> Ajouter une séance
            </button>
          </div>
        </div>
        <div className="card-body px-0 py-0">
          {workouts.length === 0 ? (
            <div className="text-center py-5">
              <FaSwimmer className="text-muted mb-3" size={40} />
              <p className="text-muted mb-0">Aucune séance d'entraînement associée à ce plan</p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate(`/admin/plans/${id}/edit`)}
              >
                <FaPlus className="me-2" /> Ajouter une séance
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout) => (
                    <tr key={workout.id}>
                      <td className="text-nowrap">
                        <div className="d-flex align-items-center">
                          <FaSwimmer className="text-primary me-2" />
                          <span>{workout.title}</span>
                        </div>
                      </td>
                      <td>
                        {workout.workout_category ? (
                          <span className={`badge bg-${
                            workout.workout_category === 'Aero 1' ? 'success' :
                            workout.workout_category === 'Vitesse' ? 'danger' :
                            workout.workout_category === 'Technique' ? 'info' :
                            workout.workout_category === 'Récupération' ? 'warning' :
                            'secondary'
                          }`}>
                            {workout.workout_category}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <a
                            href={`/workouts/${workout.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-info"
                            title="Vue utilisateur"
                          >
                            <FaExternalLinkAlt />
                          </a>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/admin/workouts/${workout.id}`)}
                            title="Voir les détails"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveWorkout(workout.id)}
                            title="Retirer du plan"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {workouts.length > 0 && (
          <div className="card-footer bg-white text-center">
            <Link to="/admin/workouts" className="btn btn-warning btn-lg d-flex align-items-center">
              <FaExternalLinkAlt className="me-2" /> Voir toutes les séances
            </Link>
          </div>
        )}
      </div>
      


      {/* Description dans une carte séparée */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h2 className="h5 mb-0">Description</h2>
        </div>
        <div className="card-body">
          <div className="mb-0">
            {plan.description ? (
              <div dangerouslySetInnerHTML={{ __html: plan.description }} />
            ) : (
              "Aucune description disponible pour ce plan d'entraînement."
            )}
          </div>
        </div>
      </div>
      
      {/* Informations dans une carte séparée */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h2 className="h5 mb-0">Informations</h2>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex align-items-center px-0">
              <FaUser className="text-primary me-3" />
              <div>
                <div className="text-muted small">Créé par</div>
                <div>User #{plan.user_id}</div>
              </div>
            </li>
            <li className="list-group-item d-flex align-items-center px-0">
              <FaCalendarAlt className="text-primary me-3" />
              <div>
                <div className="text-muted small">Créé le</div>
                <div>{new Date(plan.created_at).toLocaleDateString()}</div>
              </div>
            </li>
            {plan.updated_at && plan.updated_at !== plan.created_at && (
              <li className="list-group-item d-flex align-items-center px-0">
                <FaCalendarAlt className="text-primary me-3" />
                <div>
                  <div className="text-muted small">Dernière modification</div>
                  <div>{new Date(plan.updated_at).toLocaleDateString()}</div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
      
      

      {/* Derniers plans publiés dans une carte séparée */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h2 className="h5 mb-0">
            <FaCalendarAlt className="me-2 text-primary" />
            Derniers plans publiés
          </h2>
        </div>
        <div className="card-body">
          {recentPlansLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des plans récents...</p>
            </div>
          ) : recentPlans.length === 0 ? (
            <div className="alert alert-info">
              <FaInfoCircle className="me-2" />
              Aucun autre plan disponible pour le moment.
            </div>
          ) : (
            <div className="row g-4">
              {recentPlans.map(recentPlan => (
                <div key={recentPlan.id} className="col-md-6 col-lg-3">
                  <div className="card h-100 shadow-sm hover-lift">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <span className={`badge bg-${getCategoryBadgeColor(recentPlan.plan_category)}`}>
                          {recentPlan.plan_category || 'Non catégorisé'}
                        </span>
                        <span className="ms-auto text-muted small">
                          <FaClock className="me-1" />
                          {formatRelativeDate(recentPlan.created_at)}
                        </span>
                      </div>
                      
                      <h3 className="h5 card-title">{recentPlan.title}</h3>
                      
                      {recentPlan.description && (
                        <p className="card-text small text-muted mb-3">
                          {stripHtml(recentPlan.description).length > 60
                            ? stripHtml(recentPlan.description).substring(0, 60) + '...'
                            : stripHtml(recentPlan.description)}
                        </p>
                      )}
                      
                      <Link 
                        to={`/admin/plans/${recentPlan.id}`} 
                        className="btn btn-sm btn-outline-primary w-100"
                      >
                        <FaEye className="me-1" /> Voir le plan
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card-footer bg-white text-center">
          <Link to="/admin/plans" className="btn btn-warning btn-lg d-flex align-items-center">
            <FaExternalLinkAlt className="me-2" /> Voir tous les plans
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailPage;