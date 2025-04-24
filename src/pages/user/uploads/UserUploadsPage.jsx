// UploadsPage.jsx 
// Pages accessibles après connexion 

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlus, 
  FaFilter, 
  FaSearch, 
  FaDownload, 
  FaImage,
  FaFile,
  FaVideo,
  FaMusic,
  FaUser,
  FaCalendarAlt,
  FaTrash,
  FaEdit,
  FaInfoCircle
} from 'react-icons/fa';
import Footer from '../../../components/template/Footer';
import { getUploads, deleteUpload } from '../../../services/uploads';

const UserUploadsPage = () => {
  // États
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Charger les fichiers depuis l'API
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        setLoading(true);
        const response = await getUploads();
        setUploads(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des fichiers:', err);
        setError('Impossible de charger les fichiers. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, []);

  // Get unique file types for filter
  const fileTypes = [...new Set(uploads.map(upload => upload.type))].filter(Boolean);

  // Filtrer les fichiers
  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = upload.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || upload.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination
  const pageCount = Math.ceil(filteredUploads.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentUploads = filteredUploads.slice(offset, offset + itemsPerPage);

  // Supprimer un fichier
  const handleDelete = async (id, filename) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le fichier "${filename}" ?`)) {
      try {
        await deleteUpload(id);
        setUploads(uploads.filter(upload => upload.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <FaImage />;
      case 'video': return <FaVideo />;
      case 'audio': return <FaMusic />;
      default: return <FaFile />;
    }
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
      <>
        <main className="container py-4">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="container-fluid py-4">
        {/* En-tête */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-0">Mes Fichiers</h1>
            <p className="text-muted mb-0">
              {uploads.length} fichier{uploads.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <Link to="/user/uploads/new" className="btn btn-primary d-flex align-items-center">
            <FaPlus className="me-2" /> Nouveau fichier
          </Link>
        </div>

        {/* Filtres */}
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
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Liste des fichiers */}
        {currentUploads.length === 0 ? (
          <div className="alert alert-info d-flex align-items-center" role="alert">
            <FaInfoCircle className="me-2" />
            Aucun fichier ne correspond à vos critères de recherche.
          </div>
        ) : (
          <div className="row g-4">
            {currentUploads.map((upload) => (
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
                  <div className="card-body">
                    {upload.type === 'image' && upload.url && (
                      <div className="mb-3">
                        <img 
                          src={upload.url}
                          alt={upload.filename}
                          className="img-fluid rounded"
                          style={{ maxHeight: '150px', width: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary text-white rounded-circle p-3 me-3">
                        {getFileIcon(upload.type)}
                      </div>
                      <div>
                        <h2 className="h5 card-title mb-1">{upload.filename}</h2>
                        <small className="text-muted">{formatFileSize(upload.size)}</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center text-muted small mb-3">
                      <FaUser className="me-2" />
                      Uploadé par: User #{upload.user_id}
                    </div>

                    <div className="d-flex align-items-center text-muted small">
                      <FaCalendarAlt className="me-2" />
                      Le: {new Date(upload.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <div className="d-flex justify-content-between">
                      <a 
                        href={upload.url}
                        className="btn btn-sm btn-outline-primary"
                        download
                        title="Télécharger"
                      >
                        <FaDownload className="me-1" /> Télécharger
                      </a>
                      <div>
                        <Link to={`/user/uploads/${upload.id}/edit`} className="btn btn-sm btn-outline-secondary me-1">
                          <FaEdit />
                        </Link>
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
            ))}
          </div>
        )}

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
                  <option value="6">6</option>
                  <option value="9">9</option>
                  <option value="12">12</option>
                  <option value="15">15</option>
                </select>
                <span className="ms-2">fichiers</span>
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
      </main>
    </>
  );
};

export default UserUploadsPage;