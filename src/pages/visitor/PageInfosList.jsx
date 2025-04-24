// src/pages/visitor/PageInfosList.jsx
// Page des articles et actualités du site

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaTag, 
  FaSearch, 
  FaTimes, 
  FaNewspaper, 
  FaFileAlt,
  FaFilter,
  FaExclamationTriangle,
  FaRedo,
  FaChevronRight,
  FaInfoCircle,
  FaWater,
  FaAngleRight,
  FaBullhorn
} from 'react-icons/fa';
import { getPages } from '../../services/pages';
import { getUpload } from '../../services/uploads';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import '../../assets/styles/themes.css';
import axios from 'axios';

// Composant pour les cartes d'articles
const ArticleCard = ({ title, content, category, date, id, image, onImageError }) => {
  // Formatter le contenu pour l'aperçu
  const formatContentPreview = (content, maxLength = 150) => {
    if (!content) return "Aucun contenu disponible";
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  // Obtenir la couleur du badge selon la catégorie
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Information': return 'info';
      case 'Conseils': return 'success';
      case 'Règles': return 'warning';
      case 'Foire aux questions': return 'primary';
      default: return 'secondary';
    }
  };
  
  return (
    <div className="card h-100 shadow-sm hover-lift border-0">
      {/* Image de l'article */}
      <div style={{ height: '200px', overflow: 'hidden' }}>
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="card-img-top"
            style={{ 
              height: '100%', 
              width: '100%', 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            onError={() => onImageError && onImageError(id)}
          />
        ) : (
          <div 
            className="bg-light d-flex align-items-center justify-content-center" 
            style={{ height: '100%' }}
          >
            <FaNewspaper className="text-muted" size={40} />
          </div>
        )}
      </div>

      <div className="card-body p-4">
        {/* Catégorie */}
        {category && (
          <div className="mb-3">
            <span className={`badge bg-${getCategoryBadgeColor(category)}`}>
              {category}
            </span>
          </div>
        )}

        {/* Titre */}
        <h3 className="card-title h5 mb-3">{title}</h3>

        {/* Extrait du contenu */}
        <p className="card-text text-muted small mb-0">
          {formatContentPreview(content)}
        </p>
      </div>

      <div className="card-footer bg-white d-flex justify-content-between align-items-center p-4">
        <small className="text-muted d-flex align-items-center">
          <FaCalendarAlt className="me-1" /> 
          {new Date(date).toLocaleDateString()}
        </small>
        <Link 
          to={`/pages/${id}`} 
          className="btn btn-sm btn-outline-primary px-3"
        >
          Lire la suite <FaChevronRight className="ms-1" />
        </Link>
      </div>
    </div>
  );
};

// Composant principal
const PageInfosList = () => {
  // États
  const [pages, setPages] = useState([]);
  const [imageData, setImageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [thumbnailErrors, setThumbnailErrors] = useState({});
  const [retryCount, setRetryCount] = useState(0);

  // Catégories de pages disponibles
  const pageCategories = ['Information', 'Conseils', 'Règles', 'Foire aux questions'];

  // Récupérer les pages et leurs images
  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        
        const API_URL = 'http://127.0.0.1:8000/api';
        const BASE_URL = 'http://127.0.0.1:8000';
        
        const response = await axios.get(`${API_URL}/pages`);
        
        if (response.data && Array.isArray(response.data)) {
          setPages(response.data);
          console.log(`Récupération réussie: ${response.data.length} pages trouvées`);
          
          // Récupérer les images pour les pages qui en ont
          const pagesWithImages = response.data.filter(page => page.upload_id);
          
          if (pagesWithImages.length > 0) {
            const imagesObj = {};
            
            for (const page of pagesWithImages) {
              try {
                const uploadResponse = await getUpload(page.upload_id);
                
                if (uploadResponse.data) {
                  imagesObj[page.id] = uploadResponse.data;
                  
                  if (!uploadResponse.data.url && uploadResponse.data.path) {
                    const path = uploadResponse.data.path.startsWith('/') 
                      ? uploadResponse.data.path 
                      : `/${uploadResponse.data.path}`;
                      
                    imagesObj[page.id].url = `${BASE_URL}${path}`;
                  }
                  
                  if (!imagesObj[page.id].url && uploadResponse.data.filename) {
                    imagesObj[page.id].url = `${BASE_URL}/storage/uploads/${uploadResponse.data.filename}`;
                  }
                }
              } catch (imageErr) {
                console.error(`Erreur de chargement de l'image pour la page ${page.id}:`, imageErr);
              }
            }
            
            setImageData(imagesObj);
          }
        } else {
          console.error('Format de réponse inattendu:', response.data);
          setError('Format de réponse inattendu. Veuillez réessayer.');
        }
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des pages:', err);
        
        let errorMessage = 'Impossible de charger les articles. ';
        if (err.response) {
          errorMessage += `Erreur ${err.response.status}: ${err.response.statusText}`;
        } else if (err.request) {
          errorMessage += 'Le serveur ne répond pas. Vérifiez votre connexion internet.';
        } else {
          errorMessage += err.message;
        }
        
        setError(errorMessage);
        
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [retryCount]);

  // Gérer les erreurs de chargement des miniatures
  const handleThumbnailError = (pageId) => {
    console.log(`Erreur de chargement de l'image pour la page ${pageId}`);
    setThumbnailErrors(prev => ({
      ...prev,
      [pageId]: true
    }));
  };

  // Filtrer les pages par catégorie et terme de recherche
  const filteredPages = pages.filter(page => {
    const matchesSearch = searchTerm === '' || 
                         page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (page.content && page.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || page.page_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Fonction pour recharger les données
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container py-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="lead">Chargement des articles...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-white py-5">
          <div className="container py-4">
            <div className="row align-items-center">
              <div className="col-lg-7 mb-4 mb-lg-0">
                <div className="d-flex align-items-center mb-3">
                  <FaBullhorn className="me-3 fs-1" />
                  <h1 className="display-4 fw-bold mb-0">Actualités & Conseils</h1>
                </div>
                <p className="lead mb-4">
                  Découvrez nos derniers articles, conseils techniques et informations pour améliorer votre entraînement et rester informé.
                </p>
              </div>
              <div className="col-lg-5">
                <div className="bg-white p-4 rounded shadow-sm">
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-0">
                      <FaSearch className="text-muted" />
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-0 bg-light" 
                      placeholder="Rechercher un article..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        className="btn btn-light border-0" 
                        type="button"
                        onClick={() => setSearchTerm('')}
                      >
                        <FaTimes className="text-muted" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filtres et Contenu */}
        <section className="py-5">
          <div className="container">
            {/* Filtres de catégorie */}
            <div className="card shadow-sm border-0 mb-5">
              <div className="card-body p-4">
                <h2 className="h5 mb-3 d-flex align-items-center">
                  <FaFilter className="text-primary me-2" />
                  Filtrer par catégorie
                </h2>
                <div className="d-flex flex-wrap gap-2">
                  <button 
                    className={`btn ${categoryFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'} px-4`}
                    onClick={() => setCategoryFilter('all')}
                  >
                    Toutes les catégories
                  </button>
                  {pageCategories.map(category => (
                    <button 
                      key={category}
                      className={`btn ${categoryFilter === category ? 'btn-' + getCategoryBadgeColor(category) : 'btn-outline-' + getCategoryBadgeColor(category)} px-3`}
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Message d'erreur avec bouton de réessai */}
            {error && (
              <div className="alert alert-danger shadow-sm border-0 d-flex align-items-center mb-4" role="alert">
                <FaExclamationTriangle className="text-danger me-3 fs-4" />
                <div className="flex-grow-1">
                  <h5 className="alert-heading mb-1">Erreur de chargement</h5>
                  <p className="mb-0">{error}</p>
                </div>
                <button 
                  className="btn btn-danger ms-3"
                  onClick={handleRetry}
                >
                  <FaRedo className="me-1" /> Réessayer
                </button>
              </div>
            )}

            {/* Message quand aucun article n'est disponible */}
            {!error && pages.length === 0 && (
              <div className="card border-0 shadow-sm p-4 text-center mb-4">
                <div className="py-4">
                  <FaNewspaper className="text-muted mb-3" size={60} />
                  <h3 className="h4 mb-3">Aucun article disponible</h3>
                  <p className="text-muted mb-0">
                    Il n'y a pas encore d'articles publiés dans cette section.<br />
                    Les articles apparaîtront ici dès qu'ils seront publiés par notre équipe.
                  </p>
                </div>
              </div>
            )}

            {/* Message quand la recherche ne donne pas de résultats */}
            {!error && pages.length > 0 && filteredPages.length === 0 && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4 text-center">
                  <FaSearch className="text-muted mb-3" size={40} />
                  <h3 className="h4 mb-3">Aucun résultat trouvé</h3>
                  <p className="text-muted mb-4">
                    Aucun article ne correspond à vos critères de recherche.<br />
                    Essayez d'élargir votre recherche ou de sélectionner une autre catégorie.
                  </p>
                  <div className="d-flex justify-content-center align-items-center">
                    <span className="me-3">Termes recherchés: <strong>"{searchTerm}"</strong></span>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('all');
                      }}
                    >
                      <FaTimes className="me-1" /> Réinitialiser les filtres
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Affichage des articles quand il y a des résultats */}
            {filteredPages.length > 0 && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 mb-0">
                    <FaFileAlt className="me-2 text-primary" />
                    {filteredPages.length} Article{filteredPages.length > 1 ? 's' : ''} disponible{filteredPages.length > 1 ? 's' : ''}
                  </h2>
                  {categoryFilter !== 'all' && (
                    <div className="d-flex align-items-center">
                      <small className="text-muted me-2">Filtré par:</small>
                      <span className={`badge bg-${getCategoryBadgeColor(categoryFilter)}`}>{categoryFilter}</span>
                    </div>
                  )}
                </div>
                
                <div className="row g-4 mb-5">
                  {filteredPages.map(page => (
                    <div key={page.id} className="col-md-6 col-lg-4">
                      <ArticleCard 
                        title={page.title}
                        content={page.content}
                        category={page.page_category}
                        date={page.created_at}
                        id={page.id}
                        image={page.upload_id && imageData[page.id] && imageData[page.id].url && !thumbnailErrors[page.id] 
                          ? imageData[page.id].url 
                          : null}
                        onImageError={handleThumbnailError}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {/* Message pour les administrateurs quand aucun article n'est disponible */}
            {!error && pages.length === 0 && (
              <div className="card bg-light border-0 mt-5">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <FaInfoCircle className="text-primary me-3 fs-4" />
                    <div>
                      <h5 className="mb-1">Vous êtes administrateur ?</h5>
                      <p className="mb-0">
                        Vous pouvez créer des articles dans le panneau d'administration en vous connectant et en accédant à la section "Pages" du tableau de bord.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {pages.length > 0 && (
          <section className="py-5 bg-light">
            <div className="container text-center">
              <h2 className="mb-4 fw-bold">Restez informé</h2>
              <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: "700px" }}>
                Consultez régulièrement notre section actualités pour découvrir les dernières tendances, conseils techniques et informations sur l'entraînement aquatique.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/contact" className="btn btn-primary px-4">
                  Nous contacter
                </Link>
                <Link to="/" className="btn btn-outline-primary px-4">
                  Retour à l'accueil <FaAngleRight className="ms-1" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

// Fonction utilitaire pour obtenir la couleur du badge
const getCategoryBadgeColor = (category) => {
  switch (category) {
    case 'Information': return 'info';
    case 'Conseils': return 'success';
    case 'Règles': return 'warning';
    case 'Foire aux questions': return 'primary';
    default: return 'secondary';
  }
};

export default PageInfosList;