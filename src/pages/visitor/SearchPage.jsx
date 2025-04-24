import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaTag, 
  FaList, 
  FaAngleRight, 
  FaRegSadTear, 
  FaChevronLeft, 
  FaChevronRight 
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import { getPages } from '../../services/pages';
import { getExercises } from '../../services/exercises'; 
import { getWorkouts } from '../../services/workouts';
import { getPlans } from '../../services/plans';
import { getUpload } from '../../services/uploads';

/**
 * 🇬🇧 Search page component that displays search results from various data sources
 * 
 * 🇫🇷 Composant de page de recherche qui affiche les résultats de recherche à partir de diverses sources de données
 */
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [imageData, setImageData] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  
  /**
   * 🇬🇧 Pagination state
   * 
   * 🇫🇷 État pour la pagination
   */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
  /**
   * 🇬🇧 Fetch search results from all available sources
   * 
   * 🇫🇷 Récupérer les résultats de recherche à partir de toutes les sources disponibles
   */
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Récupérer les données de plusieurs sources
        const [pagesRes, exercisesRes, workoutsRes, plansRes] = await Promise.all([
          getPages(),
          getExercises(),
          getWorkouts(),
          getPlans()
        ]);
        
        // Transformer les données et ajouter un type pour pouvoir les différencier
        const pages = pagesRes.data.map(item => ({ ...item, type: 'page' }));
        const exercises = exercisesRes.data.map(item => ({ ...item, type: 'exercise' }));
        const workouts = workoutsRes.data.map(item => ({ ...item, type: 'workout' }));
        const plans = plansRes.data.map(item => ({ ...item, type: 'plan' }));
        
        // Combiner les résultats
        const allItems = [...pages, ...exercises, ...workouts, ...plans];
        
        // Filtrer les résultats en fonction du terme de recherche
        const filteredResults = allItems.filter(item => {
          const titleMatch = item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase());
          const descriptionMatch = item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase());
          const contentMatch = item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase());
          
          return titleMatch || descriptionMatch || contentMatch;
        });
        
        setSearchResults(filteredResults);
        
        // Récupérer les images pour les éléments qui en ont
        const itemsWithImages = filteredResults.filter(item => item.upload_id);
        
        // Récupérer les images en parallèle
        if (itemsWithImages.length > 0) {
          const imagePromises = itemsWithImages.map(item => 
            getUpload(item.upload_id)
              .then(res => ({ itemId: item.id, itemType: item.type, imageData: res.data }))
              .catch(err => {
                console.error(`Erreur de chargement de l'image pour l'élément ${item.id}:`, err);
                return { itemId: item.id, itemType: item.type, imageData: null };
              })
          );
          
          const imagesResults = await Promise.all(imagePromises);
          
          // Créer un objet avec les données d'image
          const imagesObj = imagesResults.reduce((acc, item) => {
            if (item.imageData) {
              const key = `${item.itemType}-${item.itemId}`;
              acc[key] = item.imageData;
            }
            return acc;
          }, {});
          
          setImageData(imagesObj);
        }
        
        setError(null);
        // Reset to first page when new search
        setCurrentPage(1);
      } catch (err) {
        console.error('Erreur lors de la recherche:', err);
        setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  /**
   * 🇬🇧 Format content preview by removing HTML tags and limiting length
   * 
   * 🇫🇷 Formater l'aperçu du contenu en supprimant les balises HTML et en limitant la longueur
   */
  const formatContentPreview = (content, maxLength = 150) => {
    if (!content) return "";
    
    // Supprimer les balises HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    
    // Limiter la longueur
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  /**
   * 🇬🇧 Filter results based on active tab
   * 
   * 🇫🇷 Filtrer les résultats en fonction de l'onglet actif
   */
  const filteredResults = activeTab === 'all' 
    ? searchResults 
    : searchResults.filter(item => item.type === activeTab);
  
  /**
   * 🇬🇧 Get paginated results for current page
   * 
   * 🇫🇷 Obtenir les résultats paginés pour la page actuelle
   */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  
  /**
   * 🇬🇧 Calculate total pages for pagination
   * 
   * 🇫🇷 Calculer le nombre total de pages pour la pagination
   */
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  
  /**
   * 🇬🇧 Get URL and text for item links based on type
   * 
   * 🇫🇷 Obtenir l'URL et le texte des liens d'éléments en fonction du type
   */
  const getItemLink = (item) => {
    switch(item.type) {
      case 'page':
        return { url: `/pages/${item.id}`, text: 'Voir la page' };
      case 'exercise':
        return { url: `/user/exercises/${item.id}`, text: 'Voir l\'exercice' };
      case 'workout':
        return { url: `/user/workouts/${item.id}`, text: 'Voir la séance' };
      case 'plan':
        return { url: `/user/plans/${item.id}`, text: 'Voir le plan' };
      default:
        return { url: '#', text: 'Voir le détail' };
    }
  };
  
  /**
   * 🇬🇧 Get label and badge color for each item type
   * 
   * 🇫🇷 Obtenir l'étiquette et la couleur du badge pour chaque type d'élément
   */
  const getTypeLabel = (type) => {
    switch(type) {
      case 'page': return { text: 'Page', color: 'info' };
      case 'exercise': return { text: 'Exercice', color: 'success' };
      case 'workout': return { text: 'Séance', color: 'primary' };
      case 'plan': return { text: 'Plan', color: 'warning' };
      default: return { text: 'Élément', color: 'secondary' };
    }
  };

  /**
   * 🇬🇧 Handle page change in pagination
   * 
   * 🇫🇷 Gérer le changement de page dans la pagination
   */
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top of results
      window.scrollTo({ top: document.getElementById('searchResults').offsetTop - 100, behavior: 'smooth' });
    }
  };

  /**
   * 🇬🇧 Generate array of page numbers for pagination
   * 
   * 🇫🇷 Générer un tableau de numéros de page pour la pagination
   */
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of current range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at beginning or end
      if (currentPage <= 2) {
        end = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      // Add page range
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  /**
   * 🇬🇧 Handle items per page change
   * 
   * 🇫🇷 Gérer le changement d'éléments par page
   */
  const handleItemsPerPageChange = (newValue) => {
    setItemsPerPage(newValue);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <>
      <Header />
      <main className="py-5">
        <div className="container">
          <div className="mb-5">
            <h1 className="display-5 fw-bold mb-3">
              <FaSearch className="me-3" /> 
              Résultats de recherche
            </h1>
            <div className="bg-light p-4 rounded-3">
              <form className="d-flex">
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control form-control-lg"
                    placeholder="Rechercher..." 
                    value={searchQuery}
                    disabled
                  />
                  <button className="btn btn-primary" type="button" disabled>
                    <FaSearch className="me-2" /> Rechercher
                  </button>
                </div>
              </form>
              {searchQuery && (
                <p className="text-muted mt-2 mb-0">
                  {filteredResults.length} résultat(s) trouvé(s) pour "{searchQuery}"
                </p>
              )}
            </div>
          </div>

          {/* Onglets de filtrage */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('all');
                      setCurrentPage(1);
                    }}
                  >
                    Tous ({searchResults.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'page' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('page');
                      setCurrentPage(1);
                    }}
                  >
                    Pages ({searchResults.filter(item => item.type === 'page').length})
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'exercise' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('exercise');
                      setCurrentPage(1);
                    }}
                  >
                    Exercices ({searchResults.filter(item => item.type === 'exercise').length})
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'workout' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('workout');
                      setCurrentPage(1);
                    }}
                  >
                    Séances ({searchResults.filter(item => item.type === 'workout').length})
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'plan' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('plan');
                      setCurrentPage(1);
                    }}
                  >
                    Plans ({searchResults.filter(item => item.type === 'plan').length})
                  </button>
                </li>
              </ul>
              
              {/* Options de pagination */}
              {filteredResults.length > 0 && (
                <div className="d-flex align-items-center mt-3 mt-md-0">
                  <label htmlFor="itemsPerPage" className="me-2">Afficher:</label>
                  <select
                    id="itemsPerPage"
                    className="form-select form-select-sm"
                    style={{ width: '80px' }}
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  >
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div id="searchResults">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Recherche en cours...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-5">
                <FaRegSadTear size={50} className="text-muted mb-3" />
                <h2>Aucun résultat trouvé</h2>
                <p className="text-muted">
                  Aucun élément ne correspond à votre recherche "{searchQuery}".
                </p>
                <p>
                  Suggestions :
                  <ul className="list-unstyled mt-3">
                    <li>Vérifiez l'orthographe des termes de recherche.</li>
                    <li>Essayez d'utiliser des mots plus généraux.</li>
                    <li>Essayez d'utiliser moins de mots-clés.</li>
                  </ul>
                </p>
              </div>
            ) : (
              <>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {currentItems.map(item => {
                    const itemLink = getItemLink(item);
                    const typeLabel = getTypeLabel(item.type);
                    const imageKey = `${item.type}-${item.id}`;
                    const hasImage = imageData[imageKey] && imageData[imageKey].url;
                    
                    return (
                      <div key={`${item.type}-${item.id}`} className="col">
                        <div className="card h-100 shadow-sm hover-card">
                          {hasImage && (
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                              <img 
                                src={imageData[imageKey].url} 
                                alt={item.title}
                                className="card-img-top"
                                style={{ 
                                  height: '100%', 
                                  width: '100%', 
                                  objectFit: 'cover',
                                  objectPosition: 'center'
                                }}
                              />
                            </div>
                          )}
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <span className={`badge bg-${typeLabel.color}`}>
                                {typeLabel.text}
                              </span>
                              {item.created_at && (
                                <small className="text-muted">
                                  <FaCalendarAlt className="me-1" /> 
                                  {new Date(item.created_at).toLocaleDateString()}
                                </small>
                              )}
                            </div>
                            
                            <h3 className="card-title h5 mb-3">{item.title}</h3>
                            
                            <p className="card-text text-muted">
                              {formatContentPreview(item.content || item.description)}
                            </p>
                            
                            {(item.exercise_category || item.workout_category || item.plan_category || item.page_category) && (
                              <div className="mb-3">
                                <span className="d-flex align-items-center text-muted small">
                                  <FaTag className="me-2" />
                                  {item.exercise_category || item.workout_category || item.plan_category || item.page_category}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="card-footer bg-white border-top-0">
                            <Link 
                              to={itemLink.url} 
                              className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                            >
                              {itemLink.text} <FaAngleRight className="ms-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Pagination des résultats de recherche" className="mt-5">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-muted small">
                        Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredResults.length)} sur {filteredResults.length} résultats
                      </div>
                      
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage - 1)}
                            aria-label="Page précédente"
                          >
                            <FaChevronLeft size={14} />
                          </button>
                        </li>
                        
                        {getPageNumbers().map((number, index) => (
                          <li 
                            key={index} 
                            className={`page-item ${number === currentPage ? 'active' : ''} ${number === '...' ? 'disabled' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => number !== '...' ? paginate(number) : null}
                            >
                              {number}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage + 1)}
                            aria-label="Page suivante"
                          >
                            <FaChevronRight size={14} />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SearchPage;