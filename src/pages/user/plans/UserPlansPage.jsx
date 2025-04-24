// src/pages/user/plans/UserPlansPage.jsx  
// Pages accessibles après connexion

import React, { useState, useEffect } from 'react';
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
  FaSwimmingPool
} from 'react-icons/fa';
import Footer from '../../../components/template/Footer';
import { getPlans } from '../../../services/plans';
import { getWorkoutsForPlan } from '../../../services/planWorkouts';

/**
 * 🇬🇧 User's training plans page with card display
 * 
 * 🇫🇷 Page des plans d'entraînement avec affichage en cartes
 */
const UserPlansPage = () => {
  // États
  const [plans, setPlans] = useState([]);
  const [planWorkouts, setPlanWorkouts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Catégories de plans
  const planCategories = ['Débutant', 'Intermédiaire', 'Avancé'];

  // Charger les plans et leurs séances depuis l'API
  useEffect(() => {
    const fetchPlans = async () => {
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
    };

    fetchPlans();
  }, []);

  // Filtrer les plans
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || plan.plan_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const pageCount = Math.ceil(filteredPlans.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPlans = filteredPlans.slice(offset, offset + itemsPerPage);

  // Obtenir la couleur du badge selon la catégorie
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Débutant': return 'success';
      case 'Intermédiaire': return 'warning';
      case 'Avancé': return 'danger';
      default: return 'secondary';
    }
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
        <h1 className="title-swim"> Programmes d'Entraînement</h1>

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

        {/* Liste des plans */}
        {currentPlans.length === 0 ? (
          <div className="alert alert-info d-flex align-items-center" role="alert">
            <FaInfoCircle className="me-2" />
            Aucun plan ne correspond à vos critères de recherche.
          </div>
        ) : (
          <div className="row g-4">
            {currentPlans.map((plan) => (
              <div key={plan.id} className="col-md-6 col-xl-4">
                <div className="card h-100 shadow-sm hover-lift">
                  <div className="card-header bg-white border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge bg-${getCategoryBadgeColor(plan.plan_category)}`}>
                        {plan.plan_category || 'Non catégorisé'}
                      </span>
                      <small className="text-muted">
                        ID: {plan.id}
                      </small>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary text-white rounded-circle p-3 me-3">
                        <FaSwimmingPool />
                      </div>
                      <div>
                        <h2 className="h5 card-title mb-1">{plan.title}</h2>
                        {plan.plan_category && (
                          <span className="badge bg-light text-dark">
                            <FaTag className="me-1" /> {plan.plan_category}
                          </span>
                        )}
                      </div>
                    </div>

                    {planWorkouts[plan.id] && (
                      <div className="d-flex justify-content-between align-items-center text-muted small">
                        <div className="d-flex align-items-center">
                          <FaSwimmer className="me-2" />
                          {planWorkouts[plan.id].length} séance{planWorkouts[plan.id].length > 1 ? 's' : ''}
                        </div>
                        <div className="d-flex align-items-center">
                          <FaChartLine className="me-2" />
                          Progression
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <Link to={`/user/plans/${plan.id}`} className="btn btn-outline-primary w-100">
                      <FaEye className="me-1" /> Voir les détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredPlans.length > itemsPerPage && (
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

export default UserPlansPage;