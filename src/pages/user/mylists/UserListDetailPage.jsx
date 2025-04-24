import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaList, FaSwimmer, FaDumbbell, FaCalendarAlt, FaPlus, FaTrash, 
         FaEdit, FaArrowLeft, FaExclamationTriangle, FaSave, 
         FaEye, FaInfoCircle } from 'react-icons/fa';
import { getMylistItems, addItemToMylist, removeItemFromMylist } from '../../../services/mylistItems';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import { getMylist } from '../../../services/mylists';


const UserListDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mylist, setMylist] = useState(null);
  const [items, setItems] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableItems, setAvailableItems] = useState({
    exercises: [],
    workouts: [],
    plans: []
  });
  const [selectedItemType, setSelectedItemType] = useState('exercise');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedList, setEditedList] = useState({
    title: '',
    description: ''
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [loadingStateMap, setLoadingStateMap] = useState({});

  // Traitement des éléments par catégorie
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchListData = async () => {
      setLoading(true);
      try {
        // Récupérer les détails de la liste
        const response = await getMylist(id);
        const mylistData = response.data;
        
        // Vérifier si l'utilisateur a les permissions pour cette liste
        if (mylistData.user_id !== user?.id) {
          setError("Vous n'avez pas l'autorisation d'accéder à cette liste.");
          setLoading(false);
          return;
        }
        
        setMylist(mylistData);
        setEditedList({
          title: mylistData.title,
          description: mylistData.description || ''
        });

        // Récupérer les éléments de la liste
        const itemsResponse = await getMylistItems(id);
        setItems(itemsResponse.data);

        // Grouper les éléments par type pour l'affichage
        const exerciseItems = [];
        const workoutItems = [];
        const planItems = [];

        itemsResponse.data.forEach(item => {
          const shortType = item.item_type.includes('\\') 
            ? item.item_type.split('\\').pop().toLowerCase() 
            : item.item_type;
          
          switch(shortType) {
            case 'exercise':
              exerciseItems.push(item);
              break;
            case 'workout':
              workoutItems.push(item);
              break;
            case 'plan':
              planItems.push(item);
              break;
          }
        });

        setExercises(exerciseItems);
        setWorkouts(workoutItems);
        setPlans(planItems);

        // Précharger les données des items pour afficher leurs titres
        await fetchItemsDetails(itemsResponse.data);

        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de la liste', err);
        setError('Impossible de charger les détails de cette liste. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchListData();
    }
  }, [id, user]);

  // Fonction améliorée pour récupérer les détails des éléments
  const fetchItemsDetails = async (itemsList) => {
    if (!itemsList || itemsList.length === 0) return;
    
    try {
      // Récupérer tous les exercices, séances et plans
      const [exercisesResponse, workoutsResponse, plansResponse] = await Promise.all([
        axios.get('/api/exercises'),
        axios.get('/api/workouts'),
        axios.get('/api/plans')
      ]);
      
      const allExercises = exercisesResponse.data || [];
      const allWorkouts = workoutsResponse.data || [];
      const allPlans = plansResponse.data || [];
      
      // Créer un dictionnaire pour accéder facilement aux éléments par ID
      const detailsMap = {};
      
      // Ajouter les exercices au dictionnaire
      allExercises.forEach(exercise => {
        detailsMap[`exercise_${exercise.id}`] = exercise;
      });
      
      // Ajouter les séances au dictionnaire
      allWorkouts.forEach(workout => {
        detailsMap[`workout_${workout.id}`] = workout;
      });
      
      // Ajouter les plans au dictionnaire
      allPlans.forEach(plan => {
        detailsMap[`plan_${plan.id}`] = plan;
      });
      
      console.log('Détails des éléments récupérés:', detailsMap);
      setItemDetails(detailsMap);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails des éléments', error);
    }
  };

  // Charger les éléments disponibles à ajouter
  const fetchAvailableItems = async (type) => {
    setLoadingStateMap(prev => ({ ...prev, [type]: true }));
    
    try {
      let endpoint = '';
      
      switch (type) {
        case 'exercise':
          endpoint = '/api/exercises';
          break;
        case 'workout':
          endpoint = '/api/workouts';
          break;
        case 'plan':
          endpoint = '/api/plans';
          break;
        default:
          return;
      }

      const response = await axios.get(endpoint);
      
      // Filtrer les éléments appartenant à l'utilisateur ou publics
      let availableForAdding = response.data.filter(item => 
        item.user_id === user?.id || item.is_public
      );
      
      // Exclure les éléments déjà dans la liste
      const existingItemIds = items
        .filter(item => {
          const shortType = item.item_type.includes('\\') 
            ? item.item_type.split('\\').pop().toLowerCase() 
            : item.item_type;
          return shortType === type;
        })
        .map(item => item.item_id);
      
      availableForAdding = availableForAdding.filter(item => 
        !existingItemIds.includes(item.id)
      );
      
      setAvailableItems({
        ...availableItems,
        [type + 's']: availableForAdding
      });
      
      // Définir l'ID du premier élément disponible
      if (availableForAdding.length > 0) {
        setSelectedItemId(availableForAdding[0].id.toString());
      } else {
        setSelectedItemId('');
      }
      
    } catch (err) {
      console.error(`Erreur lors de la récupération des ${type}s disponibles`, err);
    } finally {
      setLoadingStateMap(prev => ({ ...prev, [type]: false }));
    }
  };

  // Gérer le changement du type d'élément
  const handleItemTypeChange = (type) => {
    setSelectedItemType(type);
    setSelectedItemId('');
    fetchAvailableItems(type);
  };

  // Gérer l'ajout d'un élément à la liste
  const handleAddItem = async () => {
    if (!selectedItemId) return;
    
    try {
      const response = await addItemToMylist(id, {
        item_id: parseInt(selectedItemId),
        item_type: selectedItemType
      });
      
      // Ajouter le nouvel élément à la liste
      const newItem = response.data;
      setItems([...items, newItem]);
      
      // Mettre à jour les groupes d'éléments par type
      const shortType = newItem.item_type.includes('\\') 
        ? newItem.item_type.split('\\').pop().toLowerCase() 
        : newItem.item_type;
      
      if (shortType === 'exercise') {
        setExercises([...exercises, newItem]);
      } else if (shortType === 'workout') {
        setWorkouts([...workouts, newItem]);
      } else if (shortType === 'plan') {
        setPlans([...plans, newItem]);
      }
      
      // Mettre à jour les détails pour le nouvel élément
      const itemToAdd = availableItems[selectedItemType + 's'].find(
        item => item.id === parseInt(selectedItemId)
      );
      
      if (itemToAdd) {
        setItemDetails(prev => ({
          ...prev,
          [`${selectedItemType}_${itemToAdd.id}`]: itemToAdd
        }));
      }
      
      setShowAddModal(false);
      setSuccessMessage("Élément ajouté avec succès à la liste");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Erreur lors de l\'ajout d\'un élément à la liste', err);
      setError('Impossible d\'ajouter cet élément à la liste. Veuillez réessayer.');
    }
  };

  // Gérer la suppression d'un élément
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      await removeItemFromMylist(id, itemToDelete.id);
      
      // Mettre à jour la liste principale des éléments
      setItems(items.filter(item => item.id !== itemToDelete.id));
      
      // Mettre à jour les groupes d'éléments par type
      const shortType = itemToDelete.item_type.includes('\\') 
        ? itemToDelete.item_type.split('\\').pop().toLowerCase() 
        : itemToDelete.item_type;
      
      if (shortType === 'exercise') {
        setExercises(exercises.filter(item => item.id !== itemToDelete.id));
      } else if (shortType === 'workout') {
        setWorkouts(workouts.filter(item => item.id !== itemToDelete.id));
      } else if (shortType === 'plan') {
        setPlans(plans.filter(item => item.id !== itemToDelete.id));
      }
      
      setItemToDelete(null);
      setShowDeleteModal(false);
      setSuccessMessage("Élément supprimé avec succès");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'élément', err);
      setError('Impossible de supprimer cet élément. Veuillez réessayer.');
    }
  };

  // Ouvrir la modal de suppression
  const openDeleteItemModal = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // Mettre à jour les détails de la liste
  const handleUpdateList = async () => {
    if (!editedList.title.trim()) {
      setError("Le titre de la liste ne peut pas être vide");
      return;
    }
    
    try {
      await axios.put(`/api/mylists/${id}`, {
        user_id: user.id,
        title: editedList.title,
        description: editedList.description || null
      });
      
      setMylist({
        ...mylist,
        title: editedList.title,
        description: editedList.description || null
      });
      
      setEditMode(false);
      setSuccessMessage("Liste mise à jour avec succès");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la liste', err);
      setError('Impossible de mettre à jour les détails de la liste. Veuillez réessayer.');
    }
  };

  // Récupérer le titre d'un élément de façon plus fiable
  const getItemTitle = (item) => {
    // Déterminer le type court à partir du type complet
    const shortType = item.item_type.includes('\\') 
      ? item.item_type.split('\\').pop().toLowerCase() 
      : item.item_type;
    
    // Clé d'accès directe au dictionnaire des détails d'éléments
    const detailKey = `${shortType}_${item.item_id}`;
    
    if (itemDetails[detailKey] && itemDetails[detailKey].title) {
      return itemDetails[detailKey].title;
    }
    
    return `${shortType === 'exercise' ? 'Exercice' : shortType === 'workout' ? 'Séance' : 'Plan'} #${item.item_id}`;
  };

  // Récupérer la description d'un élément
  const getItemDescription = (item) => {
    const shortType = item.item_type.includes('\\') 
      ? item.item_type.split('\\').pop().toLowerCase() 
      : item.item_type;
    
    const detailKey = `${shortType}_${item.item_id}`;
    
    if (itemDetails[detailKey] && itemDetails[detailKey].description) {
      return itemDetails[detailKey].description.length > 60 
        ? itemDetails[detailKey].description.substring(0, 60) + '...' 
        : itemDetails[detailKey].description;
    }
    
    return null;
  };

  // Récupérer l'URL de détail de l'élément
  const getItemUrl = (item) => {
    const baseUrl = '/user';
    // Déterminer le type court à partir du type complet
    const itemType = item.item_type.includes('\\') 
      ? item.item_type.split('\\').pop().toLowerCase() 
      : item.item_type;

    switch (itemType) {
      case 'exercise':
        return `${baseUrl}/exercises/${item.item_id}`;
      case 'workout':
        return `${baseUrl}/workouts/${item.item_id}`;
      case 'plan':
        return `${baseUrl}/plans/${item.item_id}`;
      default:
        return '#';
    }
  };

  // Récupérer l'icône en fonction du type d'élément
  const getItemIcon = (type) => {
    // Déterminer le type court à partir du type complet
    const shortType = type.includes('\\') 
      ? type.split('\\').pop().toLowerCase() 
      : type;

    switch (shortType) {
      case 'exercise':
        return <FaDumbbell className="text-primary" />;
      case 'workout':
        return <FaSwimmer className="text-info" />;
      case 'plan':
        return <FaCalendarAlt className="text-success" />;
      default:
        return <FaList className="text-primary" />;
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <>
      <main className="container py-5">
        <div className="mb-4">
          <Link to="/user/mylists" className="btn btn-outline-secondary">
            <FaArrowLeft className="me-2" /> Retour aux carnets
          </Link>
        </div>

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <FaInfoCircle className="me-2" /> {successMessage}
            <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <FaExclamationTriangle className="me-2" /> {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des détails de la liste...</p>
          </div>
        ) : mylist ? (
          <>
            <div className="card shadow-sm mb-4 border-0">
              <div className="card-body">
                {editMode ? (
                  <div className="mb-4">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Titre <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={editedList.title}
                        onChange={(e) => setEditedList({ ...editedList, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        value={editedList.description}
                        onChange={(e) => setEditedList({ ...editedList, description: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={handleUpdateList}
                      >
                        <FaSave className="me-2" /> Enregistrer
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setEditedList({
                            title: mylist.title,
                            description: mylist.description || ''
                          });
                          setEditMode(false);
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Carte pour le titre et la description */}
                    <div className="card mb-4 shadow-sm border-0">
                      <div className="card-body text-center">
                        <div className="rounded-circle bg-primary bg-gradient text-white p-3 d-inline-block mb-3">
                          <FaList className="fs-3" />
                        </div>
                        <h1 className="h2">{mylist.title}</h1>
                        {mylist.description && (
                          <p className="text-muted">{mylist.description}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Carte pour les informations */}
                    <div className="card mb-4 shadow-sm border-0">
                      <div className="card-header bg-light">
                        <h3 className="h5 mb-0">Informations</h3>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <p className="mb-1"><strong>Créé le:</strong> {formatDate(mylist.created_at)}</p>
                            <p className="mb-1"><strong>Dernière modification:</strong> {formatDate(mylist.updated_at)}</p>
                            <p className="mb-1"><strong>Nombre d'éléments:</strong> {items.length}</p>
                          </div>
                          <div className="col-md-6 text-md-end mt-3 mt-md-0">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => setEditMode(true)}
                            >
                              <FaEdit className="me-1" /> Modifier ce carnet
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <hr className="my-4" />

                {/* Section des éléments de liste groupés par catégorie */}
                <h2 className="h4 mb-4">Éléments de la liste ({items.length})</h2>

                {items.length === 0 ? (
                  <div className="text-center py-5 bg-light rounded">
                    <div className="bg-white rounded-circle p-4 d-inline-block mb-3 shadow-sm">
                      <FaList className="text-muted fs-1" />
                    </div>
                    <p className="text-muted">Cette liste ne contient aucun élément.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/user/mylists/${id}/add-item`)}
                    >
                      <FaPlus className="me-1" /> Ajouter un élément
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Exercices */}
                    {exercises.length > 0 && (
                      <div className="card mb-4 shadow-sm border-0">
                        <div className="card-header bg-primary bg-opacity-10">
                          <div className="d-flex align-items-center">
                            <FaDumbbell className="text-primary me-2" />
                            <h3 className="h5 mb-0">Exercices ({exercises.length})</h3>
                          </div>
                        </div>
                        <div className="card-body p-0">
                          <div className="list-group list-group-flush">
                            {exercises.map((item) => {
                              // Récupérer directement les détails de l'exercice
                              const shortType = item.item_type.includes('\\') 
                                ? item.item_type.split('\\').pop().toLowerCase() 
                                : item.item_type;
                              
                              const detailKey = `${shortType}_${item.item_id}`;
                              const exercise = itemDetails[detailKey];
                              const itemDescription = exercise && exercise.description ? 
                                (exercise.description.length > 60 ? exercise.description.substring(0, 60) + '...' : exercise.description) 
                                : null;
                              
                              return (
                                <div key={item.id} className="list-group-item list-group-item-action p-3">
                                  <div className="row align-items-center">
                                    <div className="col-md-8">
                                      <h4 className="h6 mb-1 fw-bold">
                                        {exercise && exercise.title ? exercise.title : `Exercice #${item.item_id}`}
                                      </h4>
                                      {itemDescription && (
                                        <p className="mb-1 small text-muted">{itemDescription}</p>
                                      )}
                                    </div>
                                    <div className="col-md-4 text-md-end mt-2 mt-md-0">
                                      <div className="d-flex gap-2 justify-content-md-end">
                                        <Link 
                                          to={getItemUrl(item)}
                                          className="btn btn-sm btn-outline-primary"
                                        >
                                          <FaEye className="me-1 d-none d-sm-inline" /> Voir
                                        </Link>
                                        <button
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => openDeleteItemModal(item)}
                                        >
                                          <FaTrash className="me-1 d-none d-sm-inline" /> Retirer
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Séances */}
                    {workouts.length > 0 && (
                      <div className="card mb-4 shadow-sm border-0">
                        <div className="card-header bg-info bg-opacity-10">
                          <div className="d-flex align-items-center">
                            <FaSwimmer className="text-info me-2" />
                            <h3 className="h5 mb-0">Séances ({workouts.length})</h3>
                          </div>
                        </div>
                        <div className="card-body p-0">
                          <div className="list-group list-group-flush">
                            {workouts.map((item) => {
                              // Récupérer directement les détails de la séance
                              const shortType = item.item_type.includes('\\') 
                                ? item.item_type.split('\\').pop().toLowerCase() 
                                : item.item_type;
                              
                              const detailKey = `${shortType}_${item.item_id}`;
                              const workout = itemDetails[detailKey];
                              const itemDescription = workout && workout.description ? 
                                (workout.description.length > 60 ? workout.description.substring(0, 60) + '...' : workout.description) 
                                : null;
                              
                              return (
                                <div key={item.id} className="list-group-item list-group-item-action p-3">
                                  <div className="row align-items-center">
                                    <div className="col-md-8">
                                      <h4 className="h6 mb-1 fw-bold">
                                        {workout && workout.title ? workout.title : `Séance #${item.item_id}`}
                                      </h4>
                                      {itemDescription && (
                                        <p className="mb-1 small text-muted">{itemDescription}</p>
                                      )}
                                    </div>
                                    <div className="col-md-4 text-md-end mt-2 mt-md-0">
                                      <div className="d-flex gap-2 justify-content-md-end">
                                        <Link 
                                          to={getItemUrl(item)}
                                          className="btn btn-sm btn-outline-primary"
                                        >
                                          <FaEye className="me-1 d-none d-sm-inline" /> Voir
                                        </Link>
                                        <button
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => openDeleteItemModal(item)}
                                        >
                                          <FaTrash className="me-1 d-none d-sm-inline" /> Retirer
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Plans */}
                    {plans.length > 0 && (
                      <div className="card mb-4 shadow-sm border-0">
                        <div className="card-header bg-success bg-opacity-10">
                          <div className="d-flex align-items-center">
                            <FaCalendarAlt className="text-success me-2" />
                            <h3 className="h5 mb-0">Plans ({plans.length})</h3>
                          </div>
                        </div>
                        <div className="card-body p-0">
                          <div className="list-group list-group-flush">
                            {plans.map((item) => {
                              // Récupérer directement les détails du plan
                              const shortType = item.item_type.includes('\\') 
                                ? item.item_type.split('\\').pop().toLowerCase() 
                                : item.item_type;
                              
                              const detailKey = `${shortType}_${item.item_id}`;
                              const plan = itemDetails[detailKey];
                              const itemDescription = plan && plan.description ? 
                                (plan.description.length > 60 ? plan.description.substring(0, 60) + '...' : plan.description) 
                                : null;
                              
                              return (
                                <div key={item.id} className="list-group-item list-group-item-action p-3">
                                  <div className="row align-items-center">
                                    <div className="col-md-8">
                                      <h4 className="h6 mb-1 fw-bold">
                                        {plan && plan.title ? plan.title : `Plan #${item.item_id}`}
                                      </h4>
                                      {itemDescription && (
                                        <p className="mb-1 small text-muted">{itemDescription}</p>
                                      )}
                                    </div>
                                    <div className="col-md-4 text-md-end mt-2 mt-md-0">
                                      <div className="d-flex gap-2 justify-content-md-end">
                                        <Link 
                                          to={getItemUrl(item)}
                                          className="btn btn-sm btn-outline-primary"
                                        >
                                          <FaEye className="me-1 d-none d-sm-inline" /> Voir
                                        </Link>
                                        <button
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => openDeleteItemModal(item)}
                                        >
                                          <FaTrash className="me-1 d-none d-sm-inline" /> Retirer
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Message si aucun élément dans les catégories */}
                    {exercises.length === 0 && workouts.length === 0 && plans.length === 0 && (
                      <div className="alert alert-warning">
                        <FaInfoCircle className="me-2" /> Aucun élément classifiable n'a été trouvé.
                      </div>
                    )}
                  </div>
                )}

                {/* Liens vers les autres actions */}
                <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-5">
                  <Link to="/user/mylists" className="btn btn-outline-primary">
                    <FaList className="me-2" /> Voir tous mes carnets
                  </Link>
                  <Link to="/user/mylists/new" className="btn btn-success">
                    <FaPlus className="me-2" /> Créer un nouveau carnet
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="alert alert-warning" role="alert">
            <FaExclamationTriangle className="me-2" />
            Liste non trouvée ou vous n'avez pas les autorisations nécessaires pour y accéder.
          </div>
        )}
      </main>

      {/* Modal d'ajout d'élément */}
      <div
        className={`modal fade ${showAddModal ? 'show' : ''}`}
        style={{ display: showAddModal ? 'block' : 'none' }}
        tabIndex="-1"
        aria-hidden={!showAddModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Ajouter un élément à la liste</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowAddModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Type d'élément</label>
                <div className="btn-group w-100" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="itemType"
                    id="itemTypeExercise"
                    autoComplete="off"
                    checked={selectedItemType === 'exercise'}
                    onChange={() => handleItemTypeChange('exercise')}
                  />
                  <label className="btn btn-outline-primary" htmlFor="itemTypeExercise">
                    <FaDumbbell className="me-1" /> Exercice
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="itemType"
                    id="itemTypeWorkout"
                    autoComplete="off"
                    checked={selectedItemType === 'workout'}
                    onChange={() => handleItemTypeChange('workout')}
                  />
                  <label className="btn btn-outline-primary" htmlFor="itemTypeWorkout">
                    <FaSwimmer className="me-1" /> Séance
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="itemType"
                    id="itemTypePlan"
                    autoComplete="off"
                    checked={selectedItemType === 'plan'}
                    onChange={() => handleItemTypeChange('plan')}
                  />
                  <label className="btn btn-outline-primary" htmlFor="itemTypePlan">
                    <FaCalendarAlt className="me-1" /> Plan
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="itemId" className="form-label">Sélectionner un élément</label>
                {loadingStateMap[selectedItemType] ? (
                  <div className="d-flex justify-content-center my-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                    <span className="ms-2">Chargement des éléments...</span>
                  </div>
                ) : (
                  <select
                    className="form-select"
                    id="itemId"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                  >
                    {/* Options dynamiques en fonction du type sélectionné */}
                    {selectedItemType === 'exercise' ? (
                      availableItems.exercises.length > 0 ? (
                        availableItems.exercises.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))
                      ) : (
                        <option value="">Aucun exercice disponible</option>
                      )
                    ) : selectedItemType === 'workout' ? (
                      availableItems.workouts.length > 0 ? (
                        availableItems.workouts.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))
                      ) : (
                        <option value="">Aucune séance disponible</option>
                      )
                    ) : selectedItemType === 'plan' ? (
                      availableItems.plans.length > 0 ? (
                        availableItems.plans.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))
                      ) : (
                        <option value="">Aucun plan disponible</option>
                      )
                    ) : null}
                  </select>
                )}
                
                {availableItems[selectedItemType + 's'].length === 0 && !loadingStateMap[selectedItemType] && (
                  <div className="alert alert-info mt-2">
                    <FaInfoCircle className="me-2" />
                    Aucun élément disponible de ce type. Créez d'abord des {
                      selectedItemType === 'exercise' ? 'exercices' : 
                      selectedItemType === 'workout' ? 'séances' : 'plans'
                    } ou explorez les {
                      selectedItemType === 'exercise' ? 'exercices' : 
                      selectedItemType === 'workout' ? 'séances' : 'plans'
                    } publics.
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddItem}
                disabled={!selectedItemId}
              >
                <FaPlus className="me-2" /> Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade ${showAddModal ? 'show' : ''}`} style={{ display: showAddModal ? 'block' : 'none' }}></div>

      {/* Modal de confirmation de suppression */}
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
            <div className="modal-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-danger-subtle rounded-circle p-3 me-3">
                  <FaExclamationTriangle className="text-danger fs-4" />
                </div>
                <p className="mb-0">Êtes-vous sûr de vouloir retirer cet élément de la liste ? L'élément lui-même ne sera pas supprimé, seulement son association avec cette liste.</p>
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
                onClick={handleDeleteItem}
              >
                <FaTrash className="me-2" /> Retirer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }}></div>
    </>
  );
};

export default UserListDetailPage;