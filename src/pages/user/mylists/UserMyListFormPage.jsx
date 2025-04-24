import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSave, 
  FaArrowLeft, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaSwimmingPool, 
  FaWater,
  FaEdit,
  FaTrash,
  FaEye,
  FaTable
} from 'react-icons/fa';
import { createMylist, getMylist, updateMylist, getMylists } from '../../../services/mylists';
import useAuth from '../../../hooks/useAuth';

/**
 * 🇬🇧 User's list creation form page (simplified)
 * This component allows users to create new lists or edit existing ones with title and description.
 * It also displays a table of the user's existing lists at the bottom.
 * 
 * 🇫🇷 Page de formulaire de création de liste utilisateur (simplifiée)
 * Ce composant permet aux utilisateurs de créer de nouvelles listes ou de modifier des listes existantes avec titre et description.
 * Il affiche également un tableau des listes existantes de l'utilisateur en bas.
 */
const UserMyListFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  /**
   * 🇬🇧 State management for the component
   * 
   * 🇫🇷 Gestion des états du composant
   */
  const [loading, setLoading] = useState(id ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  /**
   * 🇬🇧 Form data state
   * 
   * 🇫🇷 État des données du formulaire
   */
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  /**
   * 🇬🇧 Fetch list data if in edit mode
   * 
   * 🇫🇷 Récupération des données de la liste si en mode édition
   */
  useEffect(() => {
    const fetchListData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await getMylist(id);
        const listData = response.data;
        
        // Vérifier si l'utilisateur a les permissions pour cette liste
        if (listData.user_id !== user?.id) {
          setError("Vous n'avez pas l'autorisation de modifier cette liste.");
          setLoading(false);
          return;
        }
        
        // Initialiser le formulaire avec les données existantes
        setFormData({
          title: listData.title || '',
          description: listData.description || ''
        });
        
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

  /**
   * 🇬🇧 Fetch user's lists
   * 
   * 🇫🇷 Récupération des listes de l'utilisateur
   */
  useEffect(() => {
    const fetchUserLists = async () => {
      if (!user) return;
      
      setListLoading(true);
      try {
        const response = await getMylists();
        // Filtrer les listes de l'utilisateur actuel
        const filteredLists = response.data.filter(list => list.user_id === user.id);
        setUserLists(filteredLists);
      } catch (err) {
        console.error('Erreur lors de la récupération des listes de l\'utilisateur', err);
      } finally {
        setListLoading(false);
      }
    };

    fetchUserLists();
  }, [user]);

  /**
   * 🇬🇧 Handle form field changes
   * 
   * 🇫🇷 Gestion des changements dans les champs du formulaire
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  /**
   * 🇬🇧 Handle form submission (create or update)
   * 
   * 🇫🇷 Gestion de la soumission du formulaire (création ou mise à jour)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError("Le titre de la liste ne peut pas être vide");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const data = {
        user_id: user.id,
        title: formData.title,
        description: formData.description || null
      };
      
      if (id) {
        // Mode édition
        await updateMylist(id, data);
        setSuccessMessage("Liste mise à jour avec succès!");
        setTimeout(() => {
          navigate(`/user/mylists/${id}`);
        }, 1500);
      } else {
        // Mode création
        const response = await createMylist(data);
        setSuccessMessage("Félicitation votre nouveau carnet est en ligne - Ajoutez des élements à partir de notre base!");
        
        // Ajouter la nouvelle liste à l'affichage
        setUserLists([...userLists, response.data]);
        
        // Réinitialiser le formulaire
        setFormData({
          title: '',
          description: ''
        });
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du formulaire', err);
      setError(id 
        ? 'Impossible de mettre à jour la liste. Veuillez réessayer.' 
        : 'Impossible de créer la liste. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
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
   * 🇬🇧 Handle list deletion
   * 
   * 🇫🇷 Gestion de la suppression d'une liste
   */
  const handleDeleteList = async (listId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette liste ?')) {
      try {
        // Utiliser axios directement pour la suppression
        await axios.delete(`/api/mylists/${listId}`);
        
        // Mettre à jour l'état local pour refléter la suppression
        setUserLists(userLists.filter(list => list.id !== listId));
        setSuccessMessage('Liste supprimée avec succès');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.error('Erreur lors de la suppression de la liste', err);
        setError('Impossible de supprimer la liste. Veuillez réessayer.');
      }
    }
  };

  return (
    <>
      <main className="container py-5">
        {/* Bouton de retour */}
        <div className="mb-4">
          <Link to="/user/mylists" className="btn btn-success">
            <FaArrowLeft className="me-2" /> Retour aux carnets
          </Link>
        </div>

        {/* Carte principale du formulaire */}
        <div className="card shadow-sm border-0 mb-5">
          <div className="title-swim">
            <h1>
              {id ? 'Modifier le carnet' : 'Nouveau Carnet'}
            </h1>
          </div>
          <div className="card-body p-4">
            {/* Messages de succès */}
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <FaInfoCircle className="me-2" /> {successMessage}
                <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)} aria-label="Close"></button>
              </div>
            )}

            {/* Messages d'erreur */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <FaExclamationTriangle className="me-2" /> {error}
                <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
              </div>
            )}

            {/* Affichage conditionnel selon l'état de chargement */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Chargement des données du carnet...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Champs du formulaire */}
                  <div className="col-12">
                    <div className="mb-4">
                      <label htmlFor="title" className="form-label">
                        <FaSwimmingPool className="me-2 text-primary" /> 
                        Titre <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Donnez un titre à votre carnet"
                        disabled={submitting}
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="description" className="form-label">
                        <FaWater className="me-2 text-primary" /> 
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description || ''}
                        onChange={handleChange}
                        placeholder="Décrivez l'objectif de ce carnet (optionnel)"
                        disabled={submitting}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="d-flex gap-2 justify-content-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || !formData.title.trim()}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {id ? 'Mise à jour...' : 'Création...'}
                      </>
                    ) : (
                      <>
                        <FaSave className="me-2" /> 
                        {id ? 'Mettre à jour' : 'Créer le carnet'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Tableau des listes de l'utilisateur */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-light">
            <h2 className="h5 mb-0">
              <FaTable className="me-2 text-primary" /> Mes carnets existants
            </h2>
          </div>
          <div className="card-body p-0">
            {listLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Chargement de vos carnets...</p>
              </div>
            ) : userLists.length === 0 ? (
              <div className="alert alert-info m-4">
                <FaInfoCircle className="me-2" /> Vous n'avez pas encore créé de carnet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Titre</th>
                      <th scope="col">Description</th>
                      <th scope="col">Date de création</th>
                      <th scope="col" className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userLists.map((list) => (
                      <tr key={list.id}>
                        <td>{list.title}</td>
                        <td>{list.description ? (list.description.length > 100 ? list.description.substring(0, 100) + '...' : list.description) : '-'}</td>
                        <td>{formatDate(list.created_at)}</td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <Link to={`/user/mylists/${list.id}`} className="btn btn-outline-primary" title="Voir les détails">
                              <FaEye />
                            </Link>
                            <Link to={`/user/mylists/${list.id}/edit`} className="btn btn-outline-secondary" title="Modifier">
                              <FaEdit />
                            </Link>
                            <button 
                              type="button" 
                              className="btn btn-outline-danger" 
                              title="Supprimer"
                              onClick={() => handleDeleteList(list.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default UserMyListFormPage;