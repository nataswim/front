import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaInfoCircle,
  FaSwimmer,
  FaDumbbell,
  FaCalendarCheck,
  FaSearch,
  FaPlus,
  FaFilter,
  FaExclamationTriangle,
  FaMinus
} from 'react-icons/fa';
import { getMylist } from '../../../services/mylists';
import { addItemToMylist } from '../../../services/mylistItems';
import useAuth from '../../../hooks/useAuth';
import { getExercises } from '../../../services/exercises';
import { getWorkouts } from '../../../services/workouts';
import { getPlans } from '../../../services/plans';

import axios from 'axios';

/**
 * 🇬🇧 Component for adding items to a user's personal list
 * This simplified version shows items in a table format with add/remove buttons
 * 
 * 🇫🇷 Composant pour ajouter des éléments à une liste personnelle d'utilisateur
 * Cette version simplifiée affiche les éléments dans un format tableau avec des boutons ajouter/enlever
 */
const UserMyListAddItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // States
  const [mylist, setMylist] = useState(null);
  const [itemType, setItemType] = useState('exercise');
  const [loading, setLoading] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Available items to add
  const [availableItems, setAvailableItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [existingItems, setExistingItems] = useState([]);

  // Load list and initial data
  useEffect(() => {
    const fetchListData = async () => {
      try {
        setLoadingList(true);
        
        // Fetch list details
        const listResponse = await getMylist(id);
        setMylist(listResponse.data);

        // Fetch list items to know which ones are already added
        const listItemsResponse = await axios.get(`/api/mylist/${id}/items`);
        const itemsInList = listItemsResponse.data;
        
        // Extract IDs and types from existing items
        const existingItemsData = itemsInList.map(item => {
          // Handle both formats: 'exercise' or 'App\\Models\\Exercise'
          const typeShort = item.item_type.includes('\\') 
            ? item.item_type.split('\\').pop().toLowerCase() 
            : item.item_type;
          
          return {
            id: item.item_id,
            type: typeShort
          };
        });
        
        setExistingItems(existingItemsData);
        setError(null);
      } catch (err) {
        console.error('Error loading list data:', err);
        setError('Erreur lors du chargement des données de la liste. Veuillez réessayer.');
      } finally {
        setLoadingList(false);
        
        // Initial fetch of items based on the default type
        fetchItemsByType('exercise');
      }
    };

    fetchListData();
  }, [id]);

  // Filter items when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(availableItems);
    } else {
      const filtered = availableItems.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, availableItems]);

  // Fonction pour récupérer les éléments par type
  const fetchItemsByType = async (type) => {
    try {
      setLoading(true);
      setError(null);
      
      // Déterminer le service à utiliser selon le type
      let serviceFunction;
      
      switch (type) {
        case 'exercise':
          serviceFunction = getExercises;
          break;
        case 'workout':
          serviceFunction = getWorkouts;
          break;
        case 'plan':
          serviceFunction = getPlans;
          break;
        default:
          setError(`Type d'élément non reconnu`);
          setLoading(false);
          return;
      }

      try {
        // Utiliser le service approprié pour la récupération
        const response = await serviceFunction();
        
        // Vérifier si la réponse contient des données
        if (response && response.data) {
          let items = response.data;
          
          // Vérifier si les données sont dans un format attendu
          if (!Array.isArray(items)) {
            // Si ce n'est pas un tableau, essayer de trouver les données dans une propriété data
            if (response.data.data && Array.isArray(response.data.data)) {
              items = response.data.data;
            } else {
              console.error(`Format de données inattendu pour ${type}:`, response.data);
              throw new Error(`Format de données inattendu pour ${type}`);
            }
          }
          
          // Marquer les éléments qui sont déjà dans la liste
          const itemsWithStatus = items.map(item => ({
            ...item,
            isInList: existingItems.some(
              existingItem => existingItem.id === item.id && existingItem.type === type
            )
          }));
          
          setAvailableItems(itemsWithStatus);
          setFilteredItems(itemsWithStatus);
        } else {
          console.error(`Réponse sans données pour ${type}`);
          throw new Error(`Aucune donnée reçue pour ${type}`);
        }
      } catch (apiError) {
        console.error(`Erreur lors de la récupération des ${type}s:`, apiError);
        setError(`Impossible de charger les ${type === 'exercise' ? 'exercices' : type === 'workout' ? 'séances' : 'plans'}. ${apiError.message}`);
        setAvailableItems([]);
        setFilteredItems([]);
      }
    } catch (generalError) {
      console.error(`Erreur générale:`, generalError);
      setError(`Une erreur inattendue s'est produite. Veuillez réessayer.`);
      setAvailableItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle item type change
  const handleItemTypeChange = (type) => {
    setItemType(type);
    fetchItemsByType(type);
    setSearchTerm('');
  };

  // Add item to list
  const handleAddItem = async (item) => {
    try {
      setError(null);
      setSuccess(null);
      
      const response = await addItemToMylist(id, {
        item_id: item.id,
        item_type: itemType
      });
      
      // Mettre à jour le statut de l'élément dans notre liste
      const updatedItems = availableItems.map(i => 
        i.id === item.id ? { ...i, isInList: true } : i
      );
      setAvailableItems(updatedItems);
      setFilteredItems(
        filteredItems.map(i => i.id === item.id ? { ...i, isInList: true } : i)
      );
      
      // Mettre à jour les éléments existants
      setExistingItems([...existingItems, { id: item.id, type: itemType }]);
      
      setSuccess(`"${item.title}" a été ajouté au carnet avec succès`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding item:', err);
      setError(`Impossible d'ajouter l'élément. Veuillez réessayer.`);
    }
  };

  // Remove item from list
  const handleRemoveItem = async (item) => {
    try {
      setError(null);
      setSuccess(null);
      
      // Déterminer l'ID de l'élément à supprimer
      const itemToRemove = existingItems.find(i => i.id === item.id && i.type === itemType);
      if (!itemToRemove) {
        setError("Élément introuvable dans la liste");
        return;
      }
      
      await axios.delete(`/api/mylist/${id}/items/${item.id}?item_type=${itemType}`);
      
      // Mettre à jour le statut de l'élément dans notre liste
      const updatedItems = availableItems.map(i => 
        i.id === item.id ? { ...i, isInList: false } : i
      );
      setAvailableItems(updatedItems);
      setFilteredItems(
        filteredItems.map(i => i.id === item.id ? { ...i, isInList: false } : i)
      );
      
      // Mettre à jour les éléments existants
      setExistingItems(existingItems.filter(i => !(i.id === item.id && i.type === itemType)));
      
      setSuccess(`"${item.title}" a été retiré du carnet avec succès`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error removing item:', err);
      setError(`Impossible de retirer l'élément. Veuillez réessayer.`);
    }
  };

  // Get icon based on type
  const getItemTypeIcon = () => {
    switch (itemType) {
      case 'exercise':
        return <FaDumbbell className="text-primary" />;
      case 'workout':
        return <FaSwimmer className="text-info" />;
      case 'plan':
        return <FaCalendarCheck className="text-success" />;
      default:
        return null;
    }
  };

  // Traduire le type d'élément en français
  const getTypeName = () => {
    switch (itemType) {
      case 'exercise':
        return 'exercices';
      case 'workout':
        return 'séances';
      case 'plan':
        return 'plans';
      default:
        return 'éléments';
    }
  };

  // Formatage du détail de l'élément selon son type
  const formatItemDetails = (item) => {
    switch (itemType) {
      case 'exercise':
        return `${item.exercise_level || 'Tous niveaux'} · ${item.exercise_category || 'Non catégorisé'}`;
      case 'workout':
        return `${item.workout_category || 'Non catégorisé'}`;
      case 'plan':
        return `${item.plan_category || 'Non catégorisé'}`;
      default:
        return '';
    }
  };

  return (
    <>
      <main className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Link
              to={`/user/mylists/${id}`}
              className="btn btn-outline-secondary me-3"
            >
              <FaArrowLeft className="me-2" /> Retour au carnet
            </Link>
            <div>
              <h1 className="h3 mb-0">Ajouter des éléments au carnet</h1>
              {mylist && <p className="text-muted mb-0">{mylist.title}</p>}
            </div>
          </div>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <FaExclamationTriangle className="me-2" /> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            <FaInfoCircle className="me-2" /> {success}
          </div>
        )}

        {/* Type selection */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light py-3">
            <h2 className="h5 mb-0">Choisir Une Catégorie</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-3 mb-md-0">
                <button
                  className={`btn btn-lg w-100 h-100 ${itemType === 'exercise' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleItemTypeChange('exercise')}
                >
                  <FaDumbbell className="mb-2 fs-3" />
                  <div>Exercices</div>
                </button>
              </div>
              <div className="col-md-4 mb-3 mb-md-0">
                <button
                  className={`btn btn-lg w-100 h-100 ${itemType === 'workout' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleItemTypeChange('workout')}
                >
                  <FaSwimmer className="mb-2 fs-3" />
                  <div>Séances</div>
                </button>
              </div>
              <div className="col-md-4">
                <button
                  className={`btn btn-lg w-100 h-100 ${itemType === 'plan' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleItemTypeChange('plan')}
                >
                  <FaCalendarCheck className="mb-2 fs-3" />
                  <div>Plans</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text bg-light border-light">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-light bg-light"
                    placeholder={`Rechercher des ${getTypeName()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex gap-2 justify-content-md-end">
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={() => fetchItemsByType(itemType)}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i> Actualiser
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="card shadow-sm">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
            <h2 className="h5 mb-0">
              {getItemTypeIcon()} {' '}
              Liste des {getTypeName()}
            </h2>
            <span className="badge bg-primary rounded-pill">
              {filteredItems.length} {filteredItems.length === 1 ? 'élément' : 'éléments'}
            </span>
          </div>
          <div className="card-body p-0">
            {loadingList || loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Chargement des éléments...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Titre</th>
                      <th>Détails</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className={`me-2 ${
                              itemType === 'exercise' ? 'text-primary' : 
                              itemType === 'workout' ? 'text-info' : 
                              'text-success'
                            }`}>
                              {getItemTypeIcon()}
                            </span>
                            <span>{item.title}</span>
                          </div>
                        </td>
                        <td>{formatItemDetails(item)}</td>
                        <td className="text-center">
                          {item.isInList ? (
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveItem(item)}
                            >
                              <FaMinus className="me-1" /> Enlever
                            </button>
                          ) : (
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleAddItem(item)}
                            >
                              <FaPlus className="me-1" /> Ajouter
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="bg-light rounded-circle p-4 d-inline-block mb-3">
                  {getItemTypeIcon()}
                </div>
                <p className="text-muted">
                  {searchTerm 
                    ? `Aucun ${getTypeName()} ne correspond à votre recherche` 
                    : `Aucun ${getTypeName()} disponible`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default UserMyListAddItemPage;