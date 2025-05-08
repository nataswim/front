import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser, 
  FaEdit, 
  FaSave, 
  FaTrashAlt, 
  FaSwimmer, 
  FaDumbbell,
  FaListUl,
  FaCalendarAlt,
  FaEnvelope,
  FaIdCard,
  FaShieldAlt,
  FaRunning,
  FaCalculator,
  FaClock,
  FaChartLine,
  FaBook,
  FaStopwatch,
  FaTachometerAlt,
  FaWater,
  FaHeartbeat,
  FaWeight,
  FaDrumstickBite,
  FaCalendarCheck
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';

const UserProfilePage = () => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // États pour les données utilisateur et les statistiques
  const [user, setUser] = useState({});
  const [editedUser, setEditedUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [counts, setCounts] = useState({
    exercises: 0,
    workouts: 0,
    plans: 0,
    mylists: 0
  });
  const [lastLogin, setLastLogin] = useState(null);

  // Charger les données de l'utilisateur depuis l'API
  useEffect(() => {
    const fetchUserData = async () => {
      if (authUser) {
        try {
          setLoading(true);
          
          // Récupérer les données de l'utilisateur
          const userData = {
            id: authUser.id,
            username: authUser.username,
            firstName: authUser.first_name,
            lastName: authUser.last_name,
            email: authUser.email,
            role: authUser.role_id,
            createdAt: authUser.created_at
          };
          
          setUser(userData);
          setEditedUser(userData);
          
          // Simuler une date de dernière connexion (remplacer par l'API réelle)
          setLastLogin(new Date().toISOString());
          
          // Récupérer les nombres pour chaque type de données
          try {
            const [exercisesRes, workoutsRes, plansRes, mylistsRes] = await Promise.all([
              axios.get('/api/exercises?user_id=' + authUser.id),
              axios.get('/api/workouts?user_id=' + authUser.id),
              axios.get('/api/plans?user_id=' + authUser.id),
              axios.get('/api/mylists?user_id=' + authUser.id)
            ]);
            
            setCounts({
              exercises: exercisesRes.data.length || 0,
              workouts: workoutsRes.data.length || 0,
              plans: plansRes.data.length || 0,
              mylists: mylistsRes.data.length || 0
            });
          } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            // Utiliser des données par défaut en cas d'erreur
          }
          
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [authUser]);

  // Gérer le changement de champ
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Sauvegarder les modifications
  const handleSave = useCallback((e) => {
    e.preventDefault();
    setUser({...editedUser});
    setIsEditing(false);
    setSuccessMessage("Profil mis à jour avec succès !");
    setTimeout(() => setSuccessMessage(""), 3000);
  }, [editedUser]);

  // Annuler l'édition
  const handleCancel = useCallback(() => {
    setEditedUser({...user});
    setIsEditing(false);
  }, [user]);

  // Formater une date (YYYY-MM-DD -> DD/MM/YYYY)
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Non renseigné';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  }, []);
  
  // Formater une date avec l'heure
  const formatDateTime = useCallback((dateString) => {
    if (!dateString) return 'Non renseigné';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }, []);

  return (
    <>
      <main className="container py-5">
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert" aria-live="polite">
            {successMessage}
            <button type="button" className="btn-close" onClick={() => setSuccessMessage("")} aria-label="Fermer"></button>
          </div>
        )}
        
        <h1 className="title-swim">Mon Profil</h1>
        
        {loading ? (
          <div className="text-center py-5" role="status" aria-live="polite">
            <div className="spinner-border text-secondary" aria-hidden="true">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement de vos données...</p>
          </div>
        ) : (
          <div className="row">
            {/* Colonne de gauche - Profil utilisateur */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      {/* Avatar utilisateur */}
                      <div className="rounded-circle bg-primary bg-gradient text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '120px', height: '120px', fontSize: '3rem' }} aria-hidden="true">
                        {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                      </div>
                      {!isEditing && (
                        <button 
                          className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 shadow-sm"
                          onClick={() => setIsEditing(true)}
                          aria-label="Modifier le profil"
                        >
                          <FaEdit aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    <h2 className="h4 fw-bold mb-1">{user.firstName} {user.lastName}</h2>
                    <p className="text-muted mb-2">@{user.username}</p>
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      <FaCalendarAlt className="text-secondary me-2 small" aria-hidden="true" />
                      <p className="text-muted small mb-0">
                        Membre depuis {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSave}>
                      <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">Prénom</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          value={editedUser.firstName || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Nom</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          value={editedUser.lastName || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={editedUser.email || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary d-flex align-items-center">
                          <FaSave className="me-2" aria-hidden="true" /> Enregistrer
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <h3 className="h5 fw-bold mb-3 border-bottom pb-2">
                          <FaIdCard className="text-secondary me-2" aria-hidden="true" />
                          Informations personnelles
                        </h3>
                        <ul className="list-unstyled">
                          <li className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-circle p-2 me-3" aria-hidden="true">
                              <FaUser className="text-secondary" />
                            </div>
                            <div>
                              <span className="small text-muted d-block">Nom</span>
                              <span>{user.lastName}</span>
                            </div>
                          </li>
                          <li className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-circle p-2 me-3" aria-hidden="true">
                              <FaUser className="text-secondary" />
                            </div>
                            <div>
                              <span className="small text-muted d-block">Prénom</span>
                              <span>{user.firstName}</span>
                            </div>
                          </li>
                          <li className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-circle p-2 me-3" aria-hidden="true">
                              <FaEnvelope className="text-secondary" />
                            </div>
                            <div>
                              <span className="small text-muted d-block">Email</span>
                              <span>{user.email}</span>
                            </div>
                          </li>
                          <li className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-circle p-2 me-3" aria-hidden="true">
                              <FaUser className="text-secondary" />
                            </div>
                            <div>
                              <span className="small text-muted d-block">Rôle</span>
                              <span>{user.role === 1 ? 'Administrateur' : user.role === 2 ? 'Coach' : 'Utilisateur'}</span>
                            </div>
                          </li>
                          <li className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-circle p-2 me-3" aria-hidden="true">
                              <FaCalendarAlt className="text-secondary" />
                            </div>
                            <div>
                              <span className="small text-muted d-block">Date d'inscription</span>
                              <span>{formatDateTime(user.createdAt)}</span>
                            </div>
                          </li>
                          <li className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-circle p-2 me-3" aria-hidden="true">
                              <FaCalendarCheck className="text-secondary" />
                            </div>
                            <div>
                              <span className="small text-muted d-block">Dernière connexion</span>
                              <span>{formatDateTime(lastLogin)}</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonne de droite */}
            <div className="col-lg-8">
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-header bg-primary bg-gradient text-white">
                    <h3 className="h3 mb-2"><FaWater className="me-2" aria-hidden="true" /> Ressources</h3>
                    </div>
                    <div className="card-body">
                      <div className="row text-center">
                        <div className="col-6 col-md-3 mb-3">
                          <Link to="/user/workouts" className="text-decoration-none">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '70px', height: '70px' }} aria-hidden="true">
                              <FaSwimmer className="text-secondary fs-3" />
                            </div>
                            <p className="small text-muted mb-0">Séances</p>
                          </Link>
                        </div>
                        <div className="col-6 col-md-3 mb-3">
                          <Link to="/user/exercises" className="text-decoration-none">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '70px', height: '70px' }} aria-hidden="true">
                              <FaDumbbell className="text-secondary fs-3" />
                            </div>
                            <p className="small text-muted mb-0">Exercices</p>
                          </Link>
                        </div>
                        <div className="col-6 col-md-3 mb-3">
                          <Link to="/user/plans" className="text-decoration-none">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '70px', height: '70px' }} aria-hidden="true">
                              <FaCalendarAlt className="text-secondary fs-3" />
                            </div>
                            <p className="small text-muted mb-0">Plans</p>
                          </Link>
                        </div>
                        <div className="col-6 col-md-3 mb-3">
                          <Link to="/user/mylists" className="text-decoration-none">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '70px', height: '70px' }} aria-hidden="true">
                              <FaListUl className="text-secondary fs-3" />
                            </div>
                            <p className="small text-muted mb-0">Listes</p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section de sécurité */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-header bg-primary bg-gradient text-white">
                    <h3 className="h3 mb-2">
                        <FaWater className="me-2" aria-hidden="true" /> Mon Compte
                      </h3>
                    </div>
                    <div className="card-body">
                      <div className="mb-4">
                        <h4 className="h6 mb-3">Changer le mot de passe</h4>
                        {showPassword ? (
                          <form>
                            <div className="mb-3">
                              <label htmlFor="current-password" className="form-label">Mot de passe actuel</label>
                              <input 
                                type="password" 
                                className="form-control" 
                                id="current-password" 
                                aria-describedby="current-password-help"
                              />
                              <div id="current-password-help" className="form-text">
                                Entrez votre mot de passe actuel pour confirmer votre identité
                              </div>
                            </div>
                            <div className="mb-3">
                              <label htmlFor="new-password" className="form-label">Nouveau mot de passe</label>
                              <input 
                                type="password" 
                                className="form-control" 
                                id="new-password" 
                                aria-describedby="new-password-help"
                              />
                              <div id="new-password-help" className="form-text">
                                Utilisez au moins 8 caractères avec des lettres, chiffres et symboles
                              </div>
                            </div>
                            <div className="mb-3">
                              <label htmlFor="confirm-password" className="form-label">Confirmer le mot de passe</label>
                              <input 
                                type="password" 
                                className="form-control" 
                                id="confirm-password" 
                                aria-describedby="confirm-password-help"
                              />
                              <div id="confirm-password-help" className="form-text">
                                Répétez votre nouveau mot de passe pour confirmation
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              <button type="submit" className="btn btn-primary">Modifier le mot de passe</button>
                              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(false)}>Annuler</button>
                            </div>
                          </form>
                        ) : (
                          <button 
                            className="btn btn-outline-primary" 
                            onClick={() => setShowPassword(true)}
                            aria-expanded={showPassword}
                            aria-controls="password-form"
                          >
                            Changer le mot de passe
                          </button>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-top">
                        <button 
                          className="btn btn-outline-danger d-flex align-items-center" 
                          data-bs-toggle="modal" 
                          data-bs-target="#deleteAccountModal"
                          aria-label="Supprimer mon compte"
                        >
                          <FaTrashAlt className="me-2" aria-hidden="true" /> Supprimer mon compte
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outils disponibles */}
              <div className="row">
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-header bg-primary bg-gradient text-white">
                      <h3 className="h3 mb-2">
                        <FaWater className="me-2" aria-hidden="true" /> Outils
                      </h3>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12 mb-4">
                          <h4 className="h6 mb-3 border-bottom pb-2">Documentation</h4>
                          <div className="d-grid">
                            <Link to="/user/guide" className="btn btn-primary mb-2">
                               Guide d'utilisation
                            </Link>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <h4 className="h6 mb-3 border-bottom pb-2">Natation & Triathlon</h4>
                          <ul className="list-group mb-4">
                            <li className="list-group-item">
                              <Link to="/outils/prediction-performance-natation" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaChartLine className="text-secondary me-2" aria-hidden="true" />
                                <span>Prédiction Performance Natation</span>
                              </Link>
                            </li>
                            <li className="list-group-item">
                              <Link to="/outils/chronometre-groupe" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaStopwatch className="text-secondary me-2" aria-hidden="true" />
                                <span>Chronomètre de Groupe</span>
                              </Link>
                            </li>
                            <li className="list-group-item">
                              <Link to="/outils/planificateur-natation" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaSwimmer className="text-secondary me-2" aria-hidden="true" />
                                <span>Planificateur Natation</span>
                              </Link>
                            </li>
                            <li className="list-group-item">
                              <Link to="/outils/planificateur-triathlon" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaRunning className="text-secondary me-2" aria-hidden="true" />
                                <span>Planificateur Triathlon</span>
                              </Link>
                            </li>
                          </ul>

                          <h4 className="h6 mb-3 border-bottom pb-2">Course à pied</h4>
                          <ul className="list-group mb-4">
                            <li className="list-group-item">
                              <Link to="/outils/planificateur-course" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaRunning className="text-secondary me-2" aria-hidden="true" />
                                <span>Planificateur Course à pied</span>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="col-md-6">
                          <h4 className="h6 mb-3 border-bottom pb-2">Suivi & calculs fitness</h4>
                          <ul className="list-group">
                            <li className="list-group-item">
                              <Link to="/outils/calculateur-charge-maximale" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaDumbbell className="text-secondary me-2" aria-hidden="true" />
                                <span>Calculateur de Charge Maximale (1RM)</span>
                              </Link>
                            </li>
                            <li className="list-group-item">
                              <Link to="/outils/calculateur-calories-sport" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaCalculator className="text-secondary me-2" aria-hidden="true" />
                                <span>Calculateur de Besoins Caloriques</span>
                              </Link>
                            </li>
                            <li className="list-group-item">
                              <Link to="/outils/convertisseur-kcal-macros" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaDrumstickBite className="text-secondary me-2" aria-hidden="true" />
                                <span>Convertisseur kcal/macros</span>
                              </Link>
                            </li>
                            <li className="list-group-item">
                              <Link to="/outils/calculateur-imc" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaWeight className="text-secondary me-2" aria-hidden="true" />
                                <span>Calculateur d'IMC</span>
                              </Link>
                            </li>
                            <li className="list-group-item">
                              <Link to="/outils/calculateur-tdee" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaTachometerAlt className="text-secondary me-2" aria-hidden="true" />
                                <span>Calculateur TDEE</span>
                              </Link>
                            </li>
                            <li className="list-group-item">
                              <Link to="/outils/calculateur-masse-grasse" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaWeight className="text-secondary me-2" aria-hidden="true" />
                                <span>Calculateur Masse Grasse</span>
                              </Link>
                            </li>
                            <li className="list-group-item">
                              <Link to="/outils/calculateur-hydratation" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaWater className="text-secondary me-2" aria-hidden="true" />
                                <span>Calculateur d'Hydratation</span>
                              </Link>
                            </li>
                            <li className="list-group-item">
                              <Link to="/outils/calculateur-fc-zones" className="text-decoration-none text-dark d-flex align-items-center">
                                <FaHeartbeat className="text-secondary me-2" aria-hidden="true" />
                                <span>Calculateur FC par zone</span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Modal de confirmation de suppression */}
      <div className="modal fade" id="deleteAccountModal" tabIndex="-1" aria-labelledby="deleteAccountModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title" id="deleteAccountModalLabel">Confirmer la suppression</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.</p>
              <div className="mb-3">
                <label htmlFor="confirm-delete" className="form-label">Tapez "SUPPRIMER" pour confirmer</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="confirm-delete" 
                  aria-describedby="delete-confirmation-help"
                />
                <div id="delete-confirmation-help" className="form-text">
                  Veuillez saisir exactement le mot SUPPRIMER en majuscules pour confirmer la suppression
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
              <button type="button" className="btn btn-danger">Supprimer définitivement</button>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default React.memo(UserProfilePage);