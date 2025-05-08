import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFilter, 
  FaSearch, 
  FaCalendarAlt, 
  FaInfoCircle,
  FaEye,
  FaTag,
  FaSwimmer,
  FaChartLine,
  FaSwimmingPool,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp
} from 'react-icons/fa';
import { getPlans } from '../../services/plans';
import { getWorkoutsForPlan } from '../../services/planWorkouts';

/**
 * 🇬🇧 User's training plans page with sortable table display
 * 
 * 🇫🇷 Page des plans d'entraînement avec affichage en tableau triable
 */
const UserPlansList = () => {
  // États
  const [plans, setPlans] = useState([]);
  const [planWorkouts, setPlanWorkouts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'ascending'
  });

  // Catégories de plans
  const planCategories = ['Débutant', 'Intermédiaire', 'Avancé'];

  // Charger les plans et leurs séances depuis l'API
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPlans();
      const plansData = response.data;
      setPlans(plansData);

      // Charger les séances pour chaque plan
      const workoutsData = {};
      for (const plan of plansData) {
        try {
          const workoutsResponse = await getWorkoutsForPlan(plan.id);
          workoutsData[plan.id] = workoutsResponse.data;
        } catch (err) {
          console.error(`Erreur lors du chargement des séances pour le plan ${plan.id}:`, err);
          workoutsData[plan.id] = [];
        }
      }
      setPlanWorkouts(workoutsData);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des plans:', err);
      setError('Impossible de charger les plans. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  /**
   * 🇬🇧 Request sorting by column
   * 
   * 🇫🇷 Demander le tri par colonne
   */
  const requestSort = useCallback((key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  /**
   * 🇬🇧 Get sort indicator icon
   * 
   * 🇫🇷 Obtenir l'icône d'indicateur de tri
   */
  const getSortIcon = useCallback((key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? 
        <FaSortAmountUp className="ms-1" /> : 
        <FaSortAmountDown className="ms-1" />;
    }
    return <FaSort className="ms-1 text-muted" />;
  }, [sortConfig]);

  /**
   * 🇬🇧 Apply filtering and sorting to plans
   * 
   * 🇫🇷 Appliquer le filtrage et le tri aux plans
   */
  const getSortedPlans = useMemo(() => {
    let filteredItems = plans.filter(plan => {
      const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || plan.plan_category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        // Pour la propriété workouts_count, utiliser les données calculées
        if (sortConfig.key === 'workouts_count') {
          const aCount = planWorkouts[a.id]?.length || 0;
          const bCount = planWorkouts[b.id]?.length || 0;
          if (aCount < bCount) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aCount > bCount) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
        
        // Tri standard pour les autres propriétés
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredItems;
  }, [plans, searchTerm, categoryFilter, sortConfig, planWorkouts]);

  // Pagination
  const paginationData = useMemo(() => {
    const pageCount = Math.ceil(getSortedPlans.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentPlans = getSortedPlans.slice(offset, offset + itemsPerPage);
    return { pageCount, currentPlans };
  }, [getSortedPlans, currentPage, itemsPerPage]);

  // Obtenir la couleur du badge selon la catégorie
  const getCategoryBadgeColor = useCallback((category) => {
    switch (category) {
      case 'Débutant': return 'success';
      case 'Intermédiaire': return 'warning';
      case 'Avancé': return 'danger';
      default: return 'secondary';
    }
  }, []);

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
        <h1 className="title-swim">Plans d'Entraînement</h1>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-muted mb-0">
              {plans.length} plan{plans.length > 1 ? 's' : ''} au total
            </p>
          </div>
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
                    placeholder="Rechercher un plan..."
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
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Toutes les catégories</option>
                    {planCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
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

        {/* Tableau des plans */}
        <div className="card shadow-sm mb-4">
          <div className="card-body p-0">
            {paginationData.currentPlans.length === 0 ? (
              <div className="p-4 text-center">
                <FaInfoCircle className="text-info mb-3 fs-1" />
                <p className="text-muted">Aucun plan ne correspond à vos critères de recherche.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th 
                        scope="col" 
                        style={{cursor: 'pointer', width: '70px'}}
                        onClick={() => requestSort('id')}
                      >
                        ID {getSortIcon('id')}
                      </th>
                      <th 
                        scope="col" 
                        style={{cursor: 'pointer'}}
                        onClick={() => requestSort('title')}
                      >
                        Titre {getSortIcon('title')}
                      </th>
                      <th 
                        scope="col" 
                        style={{cursor: 'pointer'}}
                        onClick={() => requestSort('plan_category')}
                      >
                        Catégorie {getSortIcon('plan_category')}
                      </th>
                      <th 
                        scope="col" 
                        className="text-center"
                        style={{cursor: 'pointer'}}
                        onClick={() => requestSort('workouts_count')}
                      >
                        <FaSwimmer className="me-1" /> Séances {getSortIcon('workouts_count')}
                      </th>
                      <th scope="col" className="text-center" style={{width: '100px'}}>Voir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginationData.currentPlans.map((plan) => (
                      <tr key={plan.id}>
                        <td>{plan.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary text-white rounded-circle p-2 me-2" style={{width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                              <FaSwimmingPool size={16} />
                            </div>
                            <span className="fw-medium">{plan.title}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge bg-${getCategoryBadgeColor(plan.plan_category)}`}>
                            {plan.plan_category || 'Non catégorisé'}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-info text-dark">
                            {planWorkouts[plan.id]?.length || 0}
                          </span>
                        </td>
                        <td className="text-center">
                          <Link 
                            to={`/user/plans/${plan.id}`}
                            className="btn btn-sm btn-outline-primary"
                            title="Voir les détails"
                          >
                            <FaEye />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {getSortedPlans.length > itemsPerPage && (
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
                <span className="ms-2">plans</span>
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
                  
                  {[...Array(paginationData.pageCount)].map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === paginationData.pageCount - 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === paginationData.pageCount - 1}
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

export default React.memo(UserPlansList);