import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaSync,
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaCalendarAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaGoogle,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { getUsers, deleteUser } from '../../../services/users';
import { getRoles } from '../../../services/roles';

/**
 * 🇬🇧 Users management page with table display format
 * 🇫🇷 Page de gestion des utilisateurs avec affichage sous forme de tableau
 */
const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'ascending'
  });

  // Fetch users and roles
  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, rolesResponse] = await Promise.all([
        getUsers(),
        getRoles()
      ]);
      setUsers(usersResponse.data);
      setRoles(rolesResponse.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Impossible de charger les utilisateurs. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * 🇬🇧 Request sorting by column
   * 🇫🇷 Demander le tri par colonne
   */
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  /**
   * 🇬🇧 Get sort indicator icon
   * 🇫🇷 Obtenir l'icône d'indicateur de tri
   */
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? 
        <FaSortUp className="ms-1" /> : 
        <FaSortDown className="ms-1" />;
    }
    return <FaSort className="ms-1 text-muted opacity-50" />;
  };

  /**
   * 🇬🇧 Generate Google search URL for the user
   * 🇫🇷 Générer l'URL de recherche Google pour l'utilisateur
   */
  const getGoogleSearchUrl = (user) => {
    const searchQuery = `${user.first_name || ''} ${user.last_name || ''} ${user.username || ''}`.trim();
    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const searchString = searchTerm.toLowerCase();
      const matchesSearch = (user.username && user.username.toLowerCase().includes(searchString)) ||
                          (user.email && user.email.toLowerCase().includes(searchString)) ||
                          (user.first_name && user.first_name.toLowerCase().includes(searchString)) ||
                          (user.last_name && user.last_name.toLowerCase().includes(searchString));
      const matchesRole = roleFilter === 'all' || user.role_id === parseInt(roleFilter);
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
      if (!a[sortConfig.key]) return 1;
      if (!b[sortConfig.key]) return -1;
      
      // String comparison
      if (typeof a[sortConfig.key] === 'string') {
        const compareResult = a[sortConfig.key].localeCompare(b[sortConfig.key]);
        return sortConfig.direction === 'ascending' ? compareResult : -compareResult;
      }
      
      // Number comparison
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.direction === 'ascending') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

  // Pagination
  const pageCount = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentUsers = filteredAndSortedUsers.slice(offset, offset + itemsPerPage);

  // Delete handler
  const handleDelete = async (id, username) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${username || id}" ?`)) {
      try {
        await deleteUser(id);
        await fetchData();
      } catch (err) {
        setError('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  // Get role name by ID
  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Non défini';
  };

  // Get role badge color
  const getRoleBadgeColor = (roleName) => {
    switch (roleName.toLowerCase()) {
      case 'admin': return 'danger';
      case 'coach': return 'success';
      case 'athlet': return 'primary';
      default: return 'secondary';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
          <h1 className="h2 mb-0">Gestion des Utilisateurs</h1>
          <p className="text-muted mb-0">
            {users.length} utilisateur{users.length > 1 ? 's' : ''} au total | {filteredAndSortedUsers.length} affiché{filteredAndSortedUsers.length > 1 ? 's' : ''}
          </p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center"
          onClick={() => navigate('/admin/users/new')}
        >
          <FaPlus className="me-2" /> Nouvel utilisateur
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
                  placeholder="Rechercher un utilisateur..."
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
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">Tous les rôles</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={fetchData}
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

      {/* Table View */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3" style={{cursor: 'pointer'}} onClick={() => requestSort('id')}>
                    ID {getSortIcon('id')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => requestSort('username')}>
                    Utilisateur {getSortIcon('username')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => requestSort('email')}>
                    Email {getSortIcon('email')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => requestSort('role_id')}>
                    Rôle {getSortIcon('role_id')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => requestSort('created_at')}>
                    Inscrit le {getSortIcon('created_at')}
                  </th>
                  <th>Google</th>
                  <th className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Aucun utilisateur ne correspond à vos critères de recherche.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => {
                    const roleName = getRoleName(user.role_id);
                    const roleColor = getRoleBadgeColor(roleName);
                    return (
                      <tr key={user.id}>
                        <td className="ps-3">{user.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className={`bg-${roleColor} text-white rounded-circle p-2 me-2`} style={{ width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <FaUser size={16} />
                            </div>
                            <div>
                              <div className="fw-medium">{user.username || '—'}</div>
                              <small className="text-muted">{user.first_name || ''} {user.last_name || ''}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaEnvelope className="text-muted me-2" />
                            {user.email}
                          </div>
                        </td>
                        <td>
                          <span className={`badge bg-${roleColor}`}>
                            {roleName}
                          </span>
                        </td>
                        <td>{formatDate(user.created_at)}</td>
                        <td className="text-center">
                          <a 
                            href={getGoogleSearchUrl(user)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                            title="Rechercher sur Google"
                          >
                            <FaGoogle className="me-1" />
                            <FaExternalLinkAlt size={10} />
                          </a>
                        </td>
                        <td className="text-end pe-3">
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => navigate(`/admin/users/${user.id}`)}
                              title="Voir les détails"
                            >
                              <FaEye />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                              title="Modifier"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(user.id, user.username || user.email)}
                              title="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {filteredAndSortedUsers.length > itemsPerPage && (
        <div className="card shadow-sm">
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

export default UsersPage;