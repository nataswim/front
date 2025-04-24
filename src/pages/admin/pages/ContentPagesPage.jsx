import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaFilter, 
  FaSearch, 
  FaSync,
  FaFileAlt,
  FaTag,
  FaUser,
  FaCalendarAlt,
  FaImage
} from 'react-icons/fa';
import { getPages, deletePage } from '../../../services/pages';
import { getUpload } from '../../../services/uploads';

const ContentPagesPage = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [imageData, setImageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [thumbnailErrors, setThumbnailErrors] = useState({});

  // Page categories
  const pageCategories = ['Information', 'Conseils', 'Règles', 'Foire aux questions'];

  // Fetch pages
  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await getPages();
      setPages(response.data);
      
      // Fetch images for pages with upload_id
      const pagesWithImages = response.data.filter(page => page.upload_id);
      
      // Fetch images in parallel
      const imagePromises = pagesWithImages.map(page => 
        getUpload(page.upload_id)
          .then(res => ({ pageId: page.id, imageData: res.data }))
          .catch(err => {
            console.error(`Erreur de chargement de l'image pour la page ${page.id}:`, err);
            return { pageId: page.id, imageData: null };
          })
      );
      
      const imagesResults = await Promise.all(imagePromises);
      
      // Create image data object
      const imagesObj = imagesResults.reduce((acc, item) => {
        if (item.imageData) {
          acc[item.pageId] = item.imageData;
        }
        return acc;
      }, {});
      
      setImageData(imagesObj);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des pages:', err);
      setError('Impossible de charger les pages. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Filter pages
  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (page.content && page.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || page.page_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const pageCount = Math.ceil(filteredPages.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPages = filteredPages.slice(offset, offset + itemsPerPage);

  // Delete handler
  const handleDelete = async (id, title) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la page "${title}" ?`)) {
      try {
        await deletePage(id);
        await fetchPages();
      } catch (err) {
        setError('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  // Handle thumbnail error
  const handleThumbnailError = (pageId) => {
    setThumbnailErrors(prev => ({
      ...prev,
      [pageId]: true
    }));
  };

  // Get category badge color
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Information': return 'info';
      case 'Conseils': return 'success';
      case 'Règles': return 'warning';
      case 'Foire aux questions': return 'primary';
      default: return 'secondary';
    }
  };

  // Format content preview - strip HTML tags and limit length
  const formatContentPreview = (content, maxLength = 150) => {
    if (!content) return "Aucun contenu";
    
    // Supprimer les balises HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    
    // Limiter la longueur
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

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

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-0">Gestion des Pages</h1>
          <p className="text-muted mb-0">
            {pages.length} page{pages.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center"
          onClick={() => navigate('/admin/pages/new')}
        >
          <FaPlus className="me-2" /> Nouvelle page
        </button>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher une page..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Toutes les catégories</option>
                    {pageCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={fetchPages}
                  title="Rafraîchir"
                >
                  <FaSync />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Pages List */}
      <div className="row g-4">
        {currentPages.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              Aucune page ne correspond à vos critères de recherche.
            </div>
          </div>
        ) : (
          currentPages.map((page) => (
            <div key={page.id} className="col-md-6 col-xl-4">
              <div className="card h-100 shadow-sm hover-lift">
                <div className="card-header bg-white border-bottom-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge bg-${getCategoryBadgeColor(page.page_category)}`}>
                      {page.page_category || 'Non catégorisé'}
                    </span>
                    <small className="text-muted">
                      ID: {page.id}
                    </small>
                  </div>
                </div>
                <div className="card-body d-flex flex-column align-items-center">
                  {/* Image or Icon */}
                  <div 
                    className="mb-3 d-flex justify-content-center align-items-center" 
                    style={{ height: '150px', width: '100%' }}
                  >
                    {page.upload_id && imageData[page.id] && imageData[page.id].url && !thumbnailErrors[page.id] ? (
                      <img
                        src={imageData[page.id].url}
                        alt={page.title}
                        className="img-fluid rounded"
                        style={{ 
                          maxHeight: '150px',
                          maxWidth: '100%',
                          objectFit: 'contain'
                        }}
                        onError={() => handleThumbnailError(page.id)}
                      />
                    ) : (
                      <div className="bg-light rounded d-flex justify-content-center align-items-center" style={{ height: '100px', width: '100px' }}>
                        {page.upload_id ? <FaImage size={32} /> : <FaFileAlt size={32} />}
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className="h5 card-title text-center mb-3">{page.title}</h3>

                  {/* Content Preview */}
                  <p className="card-text text-muted small mb-3 text-center">
                    {formatContentPreview(page.content)}
                  </p>

                  <div className="mt-auto w-100">
                    <div className="d-flex align-items-center text-muted small mb-2">
                      <FaUser className="me-2" />
                      Créé par: User #{page.user_id}
                    </div>

                    <div className="d-flex align-items-center text-muted small">
                      <FaCalendarAlt className="me-2" />
                      Dernière modification: {new Date(page.updated_at || page.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-top-0">
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/admin/pages/${page.id}`)}
                    >
                      <FaEye className="me-1" /> Détails
                    </button>
                    <div>
                      <button 
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => navigate(`/admin/pages/${page.id}/edit`)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(page.id, page.title)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredPages.length > itemsPerPage && (
        <div className="card mt-4">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <span className="me-2">Afficher</span>
              <select 
                className="form-select form-select-sm" 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(0);
                }}
                style={{width: '70px'}}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="ms-2">éléments</span>
            </div>
            
            <nav aria-label="Navigation des pages">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    &laquo;
                  </button>
                </li>
                
                {[...Array(pageCount)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === pageCount - 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pageCount - 1}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPagesPage;