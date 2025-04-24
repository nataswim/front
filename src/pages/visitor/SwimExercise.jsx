import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSwimmer, 
  FaSearch, 
  FaFilter, 
  FaTag, 
  FaSignInAlt, 
  FaUserPlus,
  FaLock,
  FaEye,
  FaSort
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import { getExercises } from '../../services/exercises';
import { getUpload } from '../../services/uploads';
import useAuth from '../../hooks/useAuth';
import RandomBanner from '../../components/template/RandomBanner';


/**
 * 🇬🇧 Swimming exercises list component with card display
 * This component displays a list of swimming exercises as cards
 * Only authenticated users can access the complete content
 * 
 * 🇫🇷 Composant de liste d'exercices de natation avec affichage en cartes
 * Ce composant affiche une liste d'exercices de natation sous forme de cartes
 * Seuls les utilisateurs authentifiés peuvent accéder au contenu complet
 */
const SwimExercise = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [exercises, setExercises] = useState([]);
  const [imageData, setImageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  // Catégories et niveaux d'exercices
  const exerciseCategories = ['Correctif De Nage', 'Correctif De Style', 'Travail de Base'];
  const exerciseLevels = ['Débutant', 'Intermédiaire', 'Avancé'];

  /**
   * 🇬🇧 Fetch exercises data from API
   * 
   * 🇫🇷 Récupération des données d'exercices depuis l'API
   */
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await getExercises();
        
        // Pour les visiteurs non authentifiés, limiter à 6 exercices comme aperçu
        const exercisesToShow = isAuthenticated 
          ? response.data 
          : response.data.slice(0, 6);
        
        setExercises(exercisesToShow);
        
        // Récupérer les images pour les exercices avec upload_id
        const exercisesWithImages = exercisesToShow.filter(exercise => exercise.upload_id);
        
        // Récupérer les images en parallèle
        const imagePromises = exercisesWithImages.map(exercise => 
          getUpload(exercise.upload_id)
            .then(res => ({ exerciseId: exercise.id, imageData: res.data }))
            .catch(err => {
              console.error(`Erreur de chargement de l'image pour l'exercice ${exercise.id}:`, err);
              return { exerciseId: exercise.id, imageData: null };
            })
        );
        
        const imagesResults = await Promise.all(imagePromises);
        
        // Créer un objet de données d'images
        const imagesObj = imagesResults.reduce((acc, item) => {
          if (item.imageData) {
            acc[item.exerciseId] = item.imageData;
          }
          return acc;
        }, {});
        
        setImageData(imagesObj);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des exercices:', err);
        setError('Pour accéder à ce contenu, veuillez vous connecter et vérifier que votre profil est complet...');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [isAuthenticated]);

  /**
   * 🇬🇧 Filter exercises based on search term, category and level
   * 
   * 🇫🇷 Filtrer les exercices selon le terme de recherche, la catégorie et le niveau
   */
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (exercise.description && exercise.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || exercise.exercise_category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || exercise.exercise_level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  /**
   * 🇬🇧 Get color for level badge
   * 
   * 🇫🇷 Obtenir la couleur pour le badge de niveau
   */
  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'Débutant': return 'success';
      case 'Intermédiaire': return 'warning';
      case 'Avancé': return 'danger';
      default: return 'secondary';
    }
  };

  /**
   * 🇬🇧 Format description for preview
   * 
   * 🇫🇷 Formater la description pour l'aperçu
   */
  const formatDescriptionPreview = (description, maxLength = 100) => {
    if (!description) return "Aucune description disponible";
    return description.length > maxLength 
      ? description.substring(0, maxLength) + '...'
      : description;
  };

  // Show loading spinner while checking authentication or loading data
  if (authLoading || loading) {
    return (
      <>
        <Header />
        <main className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des données...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
              {/* Bannière */}
              <section className="bg-primary text-white py-5">
                <div className="container">
                  <div className="row align-items-center">
                  <h1 className="title-swim display-4 fw-bold mb-4">Exercices et Éducatifs</h1>
      
                    <div className="col-lg-6">
                      <p className="lead mb-4">

                      Plongez dans un monde d'exercices variés et de techniques éprouvées pour améliorer votre nage, 
                      quel que soit votre niveau. Que vous souhaitiez perfectionner une nage, 
                      maîtriser une autre ou simplement vous sentir plus à l'aise dans l'eau, notre application est votre compagnon idéal.
                     
                      </p>

                    </div>
                    <div className="col-lg-6 text-center mt-4 mt-lg-0">
                      <FaSwimmer className="display-1" />
                    </div>
                  </div>
                </div>
              </section>
      

      <main className="container-fluid py-4">
        <p className="mb-4">Que vous soyez un nageur occasionnel, 
          un triathlète ou un passionné de natation, vous trouverez dans notre application les outils nécessaires pour atteindre vos objectifs.</p>

        {/* Filtres de recherche */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher un exercice..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-8">
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
                      {exerciseCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaFilter />
                    </span>
                    <select
                      className="form-select"
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value)}
                    >
                      <option value="all">Tous les niveaux</option>
                      {exerciseLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
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

        {/* Affichage des cartes d'exercices */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredExercises.length === 0 ? (
            <div className="col-12">
              
            </div>
          ) : (
            filteredExercises.map(exercise => (
              <div key={exercise.id} className="col">
                <div className="card h-100 shadow-sm hover-card">
                  {/* Image de l'exercice */}
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    {imageData[exercise.id] && imageData[exercise.id].url ? (
                      <img
                        src={imageData[exercise.id].url}
                        alt={exercise.title}
                        className="card-img-top"
                        style={{ 
                          height: '100%', 
                          width: '100%', 
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                      />
                    ) : (
                      <div className="d-flex justify-content-center align-items-center bg-light h-100">
                        <FaSwimmer size={50} className="text-primary opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <h5 className="card-title">{exercise.title}</h5>
                      <span className={`badge bg-${getLevelBadgeColor(exercise.exercise_level)}`}>
                        {exercise.exercise_level || 'Non défini'}
                      </span>
                    </div>
                    
                    {exercise.exercise_category && (
                      <div className="mb-3">
                        <span className="badge bg-info bg-opacity-10 text-info">
                          <FaTag className="me-1" /> {exercise.exercise_category}
                        </span>
                      </div>
                    )}
                    
                    <p className="card-text small">
                      {formatDescriptionPreview(exercise.description)}
                    </p>
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    {isAuthenticated ? (
                      <Link 
                        to={`/user/exercises/${exercise.id}`} 
                        className="btn btn-outline-primary w-100"
                      >
                        <FaEye className="me-2" /> Voir les détails
                      </Link>
                    ) : (
                      <button 
                        className="btn btn-outline-primary w-100"
                        onClick={() => navigate('/login')}
                      >
                        <FaLock className="me-2" /> Connexion requise
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Section d'incitation à l'inscription pour visiteurs non connectés */}
        {!isAuthenticated && (
          <div className="card mt-5 shadow-sm border-0">
            <div className="card-body p-5 text-center">
              <FaLock className="text-muted mb-4" size={40} />
              <h2 className="mb-4">Accédez à la bibliothéque des exercices</h2>
              <p className="lead mb-4">
                Cette page n'affiche qu'un aperçu limité des exercices disponibles pour les membres.
              </p>
              <p className="mb-4">
                Inscrivez-vous ou connectez-vous pour accéder à notre bibliothèque complète d'exercices, 
                incluant des vidéos, des instructions détaillées et des conseils techniques.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/login" className="btn btn-primary">
                  <FaSignInAlt className="me-2" /> Se connecter
                </Link>
                
              </div>
            </div>
          </div>
        )}
      </main>
      <RandomBanner />

      <Footer />
    </>
  );
};

export default SwimExercise;