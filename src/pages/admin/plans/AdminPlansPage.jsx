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
  FaCalendarAlt,
  FaUser,
  FaSwimmer,
  FaListAlt,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSort,
  FaDumbbell,
  FaTasks,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaClock,
  FaHistory
} from 'react-icons/fa';
import { getPlans, deletePlan } from '../../../services/plans';
import { getWorkoutsForPlan } from '../../../services/planWorkouts';

const AdminPlansPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [planWorkouts, setPlanWorkouts] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',  // Par défaut, tri par date de création (le plus récent en premier)
    direction: 'desc'
  });

  // Plan categories
  const planCategories = ['Débutant', 'Intermédiaire', 'Avancé'];

  // Fetch plans and their workouts
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPlans();
      const plansData = response.data;
      setPlans(plansData);
      
      // Reset page to 0 when fetching new data
      setCurrentPage(0);
      
      // Fetch workouts asynchronously
      fetchWorkoutsForPlans(plansData);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Impossible de charger les plans. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch workouts for plans in a non-blocking way
  const fetchWorkoutsForPlans = async (plansData) => {
    try {
      setLoadingWorkouts(true);
      const workoutsData = {};
      
      // Process plans in batches to avoid overwhelming the server
      const batchSize = 3;
      for (let i = 0; i < plansData.length; i += batchSize) {
        const batch = plansData.slice(i, i + batchSize);
        
        // Create an array of promises for this batch
        const promises = batch.map(plan => 
          getWorkoutsForPlan(plan.id)
            .then(response => {
              workoutsData[plan.id] = response.data;
            })
            .catch(err => {
              console.error(`Error fetching workouts for plan ${plan.id}:`, err);
              workoutsData[plan.id] = [];
            })
        );
        
        // Wait for all promises in this batch to resolve
        await Promise.all(promises);
        
        // Update state incrementally to show workouts as they load
        setPlanWorkouts(prev => ({ ...prev, ...workoutsData }));
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
    } finally {
      setLoadingWorkouts(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Request sort
  const requestSort = (key, direction = null) => {
    let newDirection = direction;
    if (!direction) {
      // If no direction specified, toggle current direction
      newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key, direction: newDirection });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? 
        <FaSortAmountUp className="ms-1" /> : 
        <FaSortAmountDown className="ms-1" />;
    }
    return <FaSort className="ms-1 text-muted" />;
  };

  // Strip HTML tags and get plain text
  const stripHtml = (html) => {
    if (!html) return '';
    
    // Create a temporary element
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Return the text content
    return temp.textContent || temp.innerText || '';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Filter and sort plans
  const getFilteredAndSortedPlans = () => {
    // First filter plans
    let filteredItems = plans.filter(plan => {
      const plainTextDescription = stripHtml(plan.description || '');
      
      const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plainTextDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || plan.plan_category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Then sort them
    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        // Special case for workouts count
        if (sortConfig.key === 'workoutCount') {
          const aCount = planWorkouts[a.id]?.length || 0;
          const bCount = planWorkouts[b.id]?.length || 0;
          
          if (aCount < bCount) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (aCount > bCount) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        }
        
        // Special case for dates
        if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
          const dateA = new Date(a[sortConfig.key] || 0);
          const dateB = new Date(b[sortConfig.key] || 0);
          
          if (dateA < dateB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (dateA > dateB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        }
        
        // Normal sorting for other fields
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredItems;
  };

  // Get paginated items
  const sortedFilteredPlans = getFilteredAndSortedPlans();
  const pageCount = Math.ceil(sortedFilteredPlans.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPlans = sortedFilteredPlans.slice(offset, offset + itemsPerPage);

  // Delete handler
  const handleDelete = async (id, title) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le plan "${title}" ?`)) {
      try {
        await deletePlan(id);
        await fetchPlans();
      } catch (err) {
        setError('Erreur lors de la suppression: ' + err.message);
      }
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

  // Limit description length
  const truncateDescription = (description, maxLength = 100) => {
    if (!description) return "Aucune description disponible";
    
    // Strip HTML tags and truncate
    const plainText = stripHtml(description);
    
    if (plainText.length <= maxLength) return plainText;
    
    return plainText.substring(0, maxLength) + '...';
  };

  // Render grid view
  const renderGridView = () => {
    return (
      <div className="row g-4">
        {currentPlans.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              <FaInfoCircle className="me-2" />
              Aucun plan ne correspond à vos critères de recherche.
            </div>
          </div>
        ) : (
          currentPlans.map((plan) => (
            <div key={plan.id} className="col-md-6 col-xl-4 col-xxl-3">
              <div className="card h-100 shadow-sm hover-lift">
                <div className="card-header bg-white border-bottom-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge bg-${getCategoryBadgeColor(plan.plan_category)}`}>
                      {plan.plan_category || 'Non catégorisé'}
                    </span>
                    <div className="d-flex align-items-center">
                      <FaClock className="text-muted me-1" size={12} />
                      <small className="text-muted">
                        {formatDate(plan.created_at)}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary text-white rounded-circle p-3 me-3">
                      <FaCalendarAlt />
                    </div>
                    <h2 className="h5 card-title mb-0">{plan.title}</h2>
                  </div>

                  <p className="card-text text-muted small mb-3">
                    {truncateDescription(plan.description, 120)}
                  </p>

                  <div className="d-flex align-items-center text-muted small mb-3">
                    <FaUser className="me-2" />
                    Créé par: User #{plan.user_id}
                  </div>

                  <div className="d-flex align-items-center small mb-3">
                    <div 
                      className={`badge ${loadingWorkouts ? 'bg-secondary' : 'bg-info text-dark'} d-flex align-items-center`}
                    >
                      <FaSwimmer className="me-1" />
                      {loadingWorkouts ? (
                        <span className="d-flex align-items-center">
                          Chargement <span className="spinner-grow spinner-grow-sm ms-1" role="status" aria-hidden="true"></span>
                        </span>
                      ) : (
                        `${planWorkouts[plan.id]?.length || 0} séance${(planWorkouts[plan.id]?.length || 0) > 1 ? 's' : ''}`
                      )}
                    </div>
                    
                    {plan.updated_at && plan.updated_at !== plan.created_at && (
                      <div className="ms-auto">
                        <FaHistory className="text-muted me-1" size={12} />
                        <small className="text-muted">
                          {formatDate(plan.updated_at)}
                        </small>
                      </div>
                    )}
                  </div>

                  {!loadingWorkouts && planWorkouts[plan.id]?.length > 0 && (
                    <div className="small">
                      <div className="fw-semibold mb-2">Séances incluses:</div>
                      <ul className="list-unstyled mb-0">
                        {planWorkouts[plan.id].slice(0, 3).map((workout) => (
                          <li key={workout.id} className="mb-1">
                            <FaListAlt className="text-primary me-2" />
                            {workout.title.length > 25 ? workout.title.substring(0, 25) + '...' : workout.title}
                          </li>
                        ))}
                        {planWorkouts[plan.id].length > 3 && (
                          <li className="text-primary">
                            + {planWorkouts[plan.id].length - 3} autre{planWorkouts[plan.id].length - 3 > 1 ? 's' : ''}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white">
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/admin/plans/${plan.id}`)}
                      title="Voir les détails"
                    >
                      <FaEye className="me-1" /> Détails
                    </button>
                    <div>
                      <button 
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => navigate(`/admin/plans/${plan.id}/edit`)}
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(plan.id, plan.title)}
                        title="Supprimer"
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
    );
  };

  // Render list view
  const renderListView = () => {
    return (
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th 
                    className="cursor-pointer"
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('id')}
                  >
                    ID {getSortIcon('id')}
                  </th>
                  <th 
                    className="cursor-pointer"
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('title')}
                  >
                    Titre {getSortIcon('title')}
                  </th>
                  <th 
                    className="cursor-pointer"
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('plan_category')}
                  >
                    Catégorie {getSortIcon('plan_category')}
                  </th>
                  <th 
                    className="cursor-pointer"
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('workoutCount')}
                  >
                    Séances {getSortIcon('workoutCount')}
                  </th>
                  <th
                    className="cursor-pointer"
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('created_at')}
                  >
                    Créé {getSortIcon('created_at')}
                  </th>
                  <th
                    className="cursor-pointer"
                    style={{cursor: 'pointer'}}
                    onClick={() => requestSort('updated_at')}
                  >
                    Modifié {getSortIcon('updated_at')}
                  </th>
                  <th>Description</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPlans.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Aucun plan ne correspond à vos critères de recherche.
                    </td>
                  </tr>
                ) : (
                  currentPlans.map((plan) => (
                    <tr key={plan.id}>
                      <td>{plan.id}</td>
                      <td>
                        <span className="fw-medium">{plan.title}</span>
                      </td>
                      <td>
                        <span className={`badge bg-${getCategoryBadgeColor(plan.plan_category)}`}>
                          {plan.plan_category || 'Non catégorisé'}
                        </span>
                      </td>
                      <td>
                        {loadingWorkouts ? (
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Chargement...</span>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center">
                            <FaDumbbell className="me-1 text-primary" />
                            <span className="badge bg-primary rounded-pill">
                              {planWorkouts[plan.id]?.length || 0}
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        <small className="text-muted">
                          {formatDate(plan.created_at)}
                        </small>
                      </td>
                      <td>
                        <small className="text-muted">
                          {formatDate(plan.updated_at)}
                        </small>
                      </td>
                      <td>
                        <div className="text-truncate" style={{maxWidth: '200px'}}>
                          {truncateDescription(plan.description, 50)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/admin/plans/${plan.id}`)}
                            title="Voir détails"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => navigate(`/admin/plans/${plan.id}/edit`)}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(plan.id, plan.title)}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (sortedFilteredPlans.length <= itemsPerPage) return null;
    
    return (
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
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="20">20</option>
              <option value="40">40</option>
            </select>
            <span className="ms-2">par page</span>
          </div>
          
          <div className="d-none d-md-flex">
            <nav aria-label="Navigation des pages">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                  <button 
                    type="button"
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
                      type="button"
                      className="page-link"
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === pageCount - 1 ? 'disabled' : ''}`}>
                  <button 
                    type="button"
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
          
          <div className="d-flex d-md-none">
            <div className="btn-group">
              <button 
                type="button"
                className="btn btn-sm btn-outline-secondary" 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <FaChevronLeft />
              </button>
              
              <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
                {currentPage + 1} / {pageCount}
              </button>
              
              <button 
                type="button"
                className="btn btn-sm btn-outline-secondary" 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pageCount - 1}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement des plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-0">Gestion des Plans</h1>
          <p className="text-muted mb-0">
            {plans.length} plan{plans.length > 1 ? 's' : ''} au total
            {sortedFilteredPlans.length !== plans.length && ` (${sortedFilteredPlans.length} filtrés)`}
          </p>
        </div>
        <div className="d-flex gap-2">
          <div className="btn-group">
            <button 
              type="button"
              className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setView('grid')}
              title="Vue en grille"
            >
              <FaTasks className={view === 'grid' ? 'text-white' : ''} />
            </button>
            <button 
              type="button"
              className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setView('list')}
              title="Vue en liste"
            >
              <FaListAlt className={view === 'list' ? 'text-white' : ''} />
            </button>
          </div>
          <button 
            className="btn btn-primary d-flex align-items-center"
            onClick={() => navigate('/admin/plans/new')}
          >
            <FaPlus className="me-2" /> Nouveau plan
          </button>
        </div>
      </div>

      {/* Filters and Sorting */}
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
                  placeholder="Rechercher un plan..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(0); // Reset to first page on search
                  }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaFilter />
                </span>
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(0); // Reset to first page on filter change
                  }}
                >
                  <option value="all">Toutes les catégories</option>
                  {planCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaSort />
                </span>
                <select
                  className="form-select"
                  value={`${sortConfig.key}-${sortConfig.direction}`}
                  onChange={(e) => {
                    const [key, direction] = e.target.value.split('-');
                    setSortConfig({ key, direction });
                    setCurrentPage(0); // Reset to first page on sort change
                  }}
                >
                  <option value="created_at-desc">Le plus récent en premier</option>
                  <option value="updated_at-desc">Dernière modification en premier</option>
                  <option value="created_at-asc">Le plus ancien en premier</option>
                  <option value="title-asc">Titre (A-Z)</option>
                  <option value="title-desc">Titre (Z-A)</option>
                  <option value="workoutCount-desc">Plus de séances</option>
                  <option value="workoutCount-asc">Moins de séances</option>
                </select>
              </div>
            </div>
            <div className="col-md-1">
              <button 
                type="button"
                className="btn btn-outline-secondary w-100" 
                onClick={fetchPlans}
                title="Rafraîchir"
              >
                <FaSync />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <FaInfoCircle className="me-2" />
          {error}
        </div>
      )}

      {/* Plans List or Grid */}
      {view === 'grid' ? renderGridView() : renderListView()}

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default AdminPlansPage;