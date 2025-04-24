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
  FaDownload,
  FaImage,
  FaFile,
  FaVideo,
  FaMusic,
  FaUser,
  FaCalendarAlt
} from 'react-icons/fa';
import { getUploads, deleteUpload } from '../../../services/uploads';

const AdminUploadsPage = () => {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [thumbnailErrors, setThumbnailErrors] = useState({});

  // Fetch uploads
  const fetchUploads = async () => {
    try {
      setLoading(true);
      const response = await getUploads();
      setUploads(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des fichiers:', err);
      setError('Impossible de charger les fichiers. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  // Get unique file types for filter
  const fileTypes = [...new Set(uploads.map(upload => upload.type))].filter(Boolean);

  // Filter uploads
  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = upload.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || upload.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination
  const pageCount = Math.ceil(filteredUploads.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentUploads = filteredUploads.slice(offset, offset + itemsPerPage);

  // Delete handler
  const handleDelete = async (id, filename) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le fichier "${filename}" ?`)) {
      try {
        await deleteUpload(id);
        await fetchUploads();
      } catch (err) {
        setError('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <FaImage size={32} />;
      case 'video': return <FaVideo size={32} />;
      case 'audio': return <FaMusic size={32} />;
      default: return <FaFile size={32} />;
    }
  };

  // Handle thumbnail error
  const handleThumbnailError = (uploadId) => {
    setThumbnailErrors(prev => ({
      ...prev,
      [uploadId]: true
    }));
  };

  // Get file type badge color
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'image': return 'info';
      case 'video': return 'danger';
      case 'audio': return 'warning';
      default: return 'secondary';
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
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
          <h1 className="h2 mb-0">Gestion des Fichiers</h1>
          <p className="text-muted mb-0">
            {uploads.length} fichier{uploads.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center"
          onClick={() => navigate('/admin/uploads/new')}
        >
          <FaPlus className="me-2" /> Nouveau fichier
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
                  placeholder="Rechercher un fichier..."
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
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">Tous les types</option>
                    {fileTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={fetchUploads}
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

      {/* Uploads List */}
      <div className="row g-4">
        {currentUploads.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              Aucun fichier ne correspond à vos critères de recherche.
            </div>
          </div>
        ) : (
          currentUploads.map((upload) => (
            <div key={upload.id} className="col-md-6 col-xl-4">
              <div className="card h-100 shadow-sm hover-lift">
                <div className="card-header bg-white border-bottom-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge bg-${getTypeBadgeColor(upload.type)}`}>
                      {upload.type || 'Inconnu'}
                    </span>
                    <small className="text-muted">
                      ID: {upload.id}
                    </small>
                  </div>
                </div>
                <div className="card-body d-flex flex-column align-items-center">
                  {/* Thumbnail or Icon */}
                  <div 
                    className="mb-3 d-flex justify-content-center align-items-center" 
                    style={{ height: '150px', width: '100%' }}
                  >
                    {upload.type === 'image' && upload.url && !thumbnailErrors[upload.id] ? (
                      <img
                        src={upload.url}
                        alt={upload.filename}
                        className="img-fluid rounded"
                        style={{ 
                          maxHeight: '150px',
                          maxWidth: '100%',
                          objectFit: 'contain'
                        }}
                        onError={() => handleThumbnailError(upload.id)}
                      />
                    ) : (
                      <div className="bg-light rounded d-flex justify-content-center align-items-center" style={{ height: '100px', width: '100px' }}>
                        {getFileIcon(upload.type)}
                      </div>
                    )}
                  </div>
                  
                  {/* File Info */}
                  <div className="text-center mb-3">
                    <h3 className="h5 card-title">{upload.filename}</h3>
                    <small className="text-muted d-block">{formatFileSize(upload.size)}</small>
                  </div>

                  <div className="mt-auto w-100">
                    <div className="d-flex align-items-center text-muted small mb-2">
                      <FaUser className="me-2" />
                      Uploadé par: User #{upload.user_id}
                    </div>

                    <div className="d-flex align-items-center text-muted small">
                      <FaCalendarAlt className="me-2" />
                      Le: {new Date(upload.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-top-0">
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/admin/uploads/${upload.id}`)}
                    >
                      <FaEye className="me-1" /> Détails
                    </button>
                    <div>
                      <button 
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => navigate(`/admin/uploads/${upload.id}/edit`)}
                      >
                        <FaEdit />
                      </button>
                      <a 
                        href={upload.url}
                        className="btn btn-sm btn-outline-success me-1"
                        download
                        title="Télécharger"
                      >
                        <FaDownload />
                      </a>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(upload.id, upload.filename)}
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
      {filteredUploads.length > itemsPerPage && (
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

export default AdminUploadsPage;