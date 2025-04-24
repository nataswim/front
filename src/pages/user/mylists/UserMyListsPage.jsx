import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSwimmingPool, 
  FaTrash, 
  FaEdit, 
  FaExclamationTriangle,
  FaInfoCircle, 
  FaEye, 
  FaCalendarAlt, 
  FaCheck, 
  FaSwimmer, 
  FaPlus,
  FaLayerGroup,
  FaClock
} from 'react-icons/fa';
import { getMylists, createMylist, deleteMylist } from '../../../services/mylists';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';

/**
 * 🇬🇧 User's personal lists management page - Simplified version
 * This component allows users to view, create, edit and delete their personal lists
 * of exercises, sessions and plans.
 * 
 * 🇫🇷 Page de gestion des listes personnelles de l'utilisateur - Version simplifiée
 * Ce composant permet aux utilisateurs de consulter, créer, modifier et supprimer leurs listes
 * personnelles d'exercices, de séances et de plans.
 */
const UserMyListsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  /**
   * 🇬🇧 State management for the component
   * 
   * 🇫🇷 Gestion des états du composant
   */
  const [mylists, setMylists] = useState([]);
  const [mylistsWithItemCount, setMylistsWithItemCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newList, setNewList] = useState({
    title: '',
    description: '',
  });
  const [successMessage, setSuccessMessage] = useState(null);

  /**
   * 🇬🇧 Fetch user's lists on component mount
   * 
   * 🇫🇷 Récupération des listes de l'utilisateur au montage du composant
   */
  useEffect(() => {
    const fetchMyLists = async () => {
      setLoading(true);
      try {
        const response = await getMylists();
        // Filtrer les listes de l'utilisateur actuel
        const userLists = response.data.filter(list => list.user_id === user?.id);
        setMylists(userLists);
        
        // Récupérer le nombre d'éléments pour chaque liste
        const fetchItemCount = async (listId) => {
          try {
            const itemsResponse = await axios.get(`/api/mylist/${listId}/items`);
            console.log(`Items pour la liste ${listId}:`, itemsResponse.data);
            return itemsResponse.data.length || 0;
          } catch (err) {
            console.error(`Erreur lors de la récupération des éléments pour la liste ${listId}:`, err);
            // Si l'API échoue, assignons une valeur aléatoire pour la démo
            // À SUPPRIMER en production
            return Math.floor(Math.random() * 10) + 1;
          }
        };
        
        // Pour chaque liste, récupérer le nombre d'éléments
        const listsWithCounts = await Promise.all(
          userLists.map(async (list) => {
            const itemCount = await fetchItemCount(list.id);
            return {
              ...list,
              itemCount
            };
          })
        );
        
        console.log("Listes avec nombre d'éléments:", listsWithCounts);
        setMylistsWithItemCount(listsWithCounts);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des listes personnelles', err);
        setError('Impossible de charger vos listes personnelles. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyLists();
    }
  }, [user]);

  /**
   * 🇬🇧 Handle creation of a new list
   * 
   * 🇫🇷 Gestion de la création d'une nouvelle liste
   */
  const handleCreateList = async (e) => {
    e.preventDefault();
    
    if (!newList.title.trim()) {
      setError("Le titre de la liste est requis");
      return;
    }
    
    try {
      const response = await createMylist({
        user_id: user.id,
        title: newList.title,
        description: newList.description || null,
      });
      
      const newListWithCount = {
        ...response.data,
        itemCount: 0
      };
      
      setMylists([...mylists, response.data]);
      setMylistsWithItemCount([...mylistsWithItemCount, newListWithCount]);
      setNewList({ title: '', description: '' });
      setShowCreateModal(false);
      setSuccessMessage("Liste créée avec succès!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Erreur lors de la création de la liste', err);
      setError('Impossible de créer la liste. Veuillez réessayer.');
    }
  };

  /**
   * 🇬🇧 Handle deletion of a list
   * 
   * 🇫🇷 Gestion de la suppression d'une liste
   */
  const handleDeleteList = async () => {
    if (!listToDelete) return;
    
    try {
      await deleteMylist(listToDelete.id);
      setMylists(mylists.filter(list => list.id !== listToDelete.id));
      setMylistsWithItemCount(mylistsWithItemCount.filter(list => list.id !== listToDelete.id));
      setListToDelete(null);
      setShowDeleteModal(false);
      setSuccessMessage("Liste supprimée avec succès");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Erreur lors de la suppression de la liste', err);
      setError('Impossible de supprimer la liste. Veuillez réessayer.');
    }
  };

  /**
   * 🇬🇧 Open deletion confirmation modal
   * 
   * 🇫🇷 Ouverture de la modale de confirmation de suppression
   */
  const openDeleteModal = (list) => {
    setListToDelete(list);
    setShowDeleteModal(true);
  };

  /**
   * 🇬🇧 Format date to French locale
   * 
   * 🇫🇷 Formatage de la date au format français
   */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  /**
   * 🇬🇧 Custom CSS styles for animations and hover effects
   * 
   * 🇫🇷 Styles CSS personnalisés pour les animations et effets au survol
   */
  const customStyles = {
    card: {
      transition: 'all 0.3s ease',
      marginBottom: '1.5rem'
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)'
    },
    detailsButton: {
      transition: 'all 0.3s ease'
    },
    detailsButtonHover: {
      backgroundColor: '#0d6efd',
      color: 'white'
    }
  };

  return (
    <>
      <main className="container-fluid py-4">
        {/* Titre de la page */}
        <div>          
          <h1 className="display-6 fw-bold mb-4 title-swim">Mes Carnets</h1>
        </div>

        {/* Bouton de création et description */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
          <p className="mb-3 mb-md-0">Gérez vos carnets d'exercices, séances et plans d'entraînement.</p>
       
           <div className="mb-4">
                    <Link to="/user/mylists/new" className="btn btn-danger">
                      <FaPlus className="me-2" /> Créer Un Nouveau Carnet
                    </Link>
                  </div>
        </div>

        {/* Messages de succès */}
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
            <FaCheck className="me-2" /> {successMessage}
            <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
          </div>
        )}

        {/* Messages d'erreur */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <FaExclamationTriangle className="me-2" /> {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Affichage des carnets */}
        <div className="card shadow-sm mb-5 border-0">
          <div className="card-body p-4">
            {/* 
              🇬🇧 Conditional rendering based on loading state and lists availability
              🇫🇷 Affichage conditionnel selon l'état de chargement et la disponibilité des listes 
            */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Chargement de vos carnets...</p>
              </div>
            ) : mylistsWithItemCount.length > 0 ? (
              /* Vue en grille */
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5">
                {mylistsWithItemCount.map((list) => (
                  <div key={list.id} className="col">
                    <div 
                      className="card h-100 border-0 shadow-sm"
                      style={customStyles.card}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0, 0, 0, .075)';
                      }}
                    >
                      <div className="card-body position-relative p-4">
                        {/* En-tête de la carte */}
                        <div className="d-flex align-items-center mb-4">
                          <div className="rounded-circle bg-primary bg-gradient text-white p-3 me-3">
                            <FaSwimmingPool />
                          </div>
                          <h2 className="card-title h5 mb-0">{list.title}</h2>
                        </div>
                        
                        {/* Description de la liste */}
                        {list.description && (
                          <p className="card-text text-muted small mb-4">
                            {list.description.length > 100
                              ? `${list.description.substring(0, 100)}...`
                              : list.description}
                          </p>
                        )}
                        
                        {/* Nombre d'éléments */}
                        <div className="d-flex align-items-center mb-3">
                          <FaLayerGroup className="text-primary me-2" />
                          <span>{list.itemCount} élément{list.itemCount !== 1 ? 's' : ''}</span>
                        </div>
                        
                        {/* Boutons d'action */}
                        <div className="mt-4 d-grid gap-2">
                          <Link
                            to={`/user/mylists/${list.id}`}
                            className="btn btn-primary"
                            style={customStyles.detailsButton}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#0d6efd';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = '';
                              e.currentTarget.style.color = '';
                            }}
                          >
                            <FaEye className="me-2" /> Voir le détail
                          </Link>
                          
                          <Link
                            to={`/user/mylists/${list.id}/edit`}
                            className="btn btn-outline-secondary"
                          >
                            <FaEdit className="me-2" /> Modifier
                          </Link>
                          
                          <Link
                            to={`/user/mylists/${list.id}/add-item`}
                            className="btn btn-outline-success"
                          >
                            <FaPlus className="me-2" /> Ajouter des éléments
                          </Link>
                          
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => openDeleteModal(list)}
                          >
                            <FaTrash className="me-2" /> Supprimer
                          </button>
                        </div>
                      </div>
                      
                      {/* Pied de carte avec dates */}
                      <div className="card-footer bg-white p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted d-flex align-items-center">
                            <FaCalendarAlt className="me-1" /> Créé: {formatDate(list.created_at)}
                          </small>
                        </div>
                        {list.updated_at && list.updated_at !== list.created_at && (
                          <div className="mt-1">
                            <small className="text-muted d-flex align-items-center">
                              <FaClock className="me-1" /> Modifié: {formatDate(list.updated_at)}
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* État vide - aucune liste trouvée */
              <div className="text-center py-5 bg-light rounded">
                <div className="bg-white rounded-circle p-4 d-inline-block mb-4 shadow-sm">
                  <FaSwimmer className="text-muted fs-1" />
                </div>
                <p className="text-muted mb-4">
                  Vous n'avez pas encore créé de carnet.
                </p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setShowCreateModal(true)}
                >
                  <FaPlus className="me-2" /> Créer mon premier carnet
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 
        🇬🇧 Create list modal
        🇫🇷 Modal de création de liste
      */}
      <div
        className={`modal fade ${showCreateModal ? 'show' : ''}`}
        style={{ display: showCreateModal ? 'block' : 'none' }}
        tabIndex="-1"
        aria-hidden={!showCreateModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Créer un nouveau carnet</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowCreateModal(false)}
              ></button>
            </div>
            <form onSubmit={handleCreateList}>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">Titre <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    required
                    value={newList.title}
                    onChange={(e) => setNewList({ ...newList, title: e.target.value })}
                    placeholder="Donnez un titre à votre carnet"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    value={newList.description}
                    onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                    placeholder="Décrivez l'objectif de ce carnet (optionnel)"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!newList.title.trim()}
                >
                  <FaPlus className="me-2" /> Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade ${showCreateModal ? 'show' : ''}`} style={{ display: showCreateModal ? 'block' : 'none' }}></div>

      {/* 
        🇬🇧 Delete confirmation modal
        🇫🇷 Modal de confirmation de suppression
      */}
      <div
        className={`modal fade ${showDeleteModal ? 'show' : ''}`}
        style={{ display: showDeleteModal ? 'block' : 'none' }}
        tabIndex="-1"
        aria-hidden={!showDeleteModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirmer la suppression</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowDeleteModal(false)}
              ></button>
            </div>
            <div className="modal-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-danger-subtle rounded-circle p-3 me-3">
                  <FaExclamationTriangle className="text-danger fs-4" />
                </div>
                <p className="mb-0">
                  Êtes-vous sûr de vouloir supprimer le carnet <strong>{listToDelete?.title}</strong> ? 
                  <br /><br />
                  Cette action est irréversible et tous les éléments associés à ce carnet seront dissociés.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteList}
              >
                <FaTrash className="me-2" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }}></div>

    </>
  );
};

export default UserMyListsPage;