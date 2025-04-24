import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSwimmingPool, FaPlus, FaSearch, FaWater, FaSwimmer } from 'react-icons/fa';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { getMylists } from '../../services/mylists';

/**
 * 🇬🇧 User's personal lists display component
 * This component displays all the personal lists created by the user,
 * with search functionality and links to view or create lists.
 * 
 * 🇫🇷 Composant d'affichage des listes personnelles de l'utilisateur
 * Ce composant affiche toutes les listes personnelles créées par l'utilisateur,
 * avec une fonctionnalité de recherche et des liens pour consulter ou créer des listes.
 */
const UserMyLists = () => {
  const { user } = useAuth();
  
  /**
   * 🇬🇧 State management for the component
   * 
   * 🇫🇷 Gestion des états du composant
   */
  const [mylists, setMylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * 🇬🇧 Fetch user's lists on component mount
   * 
   * 🇫🇷 Récupération des listes de l'utilisateur au montage du composant
   */
  useEffect(() => {
    const fetchMyLists = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Utiliser la fonction du service plutôt qu'axios directement
        const response = await getMylists();
        console.log('Listes récupérées:', response.data);
        
        // Filtrer les listes de l'utilisateur actuel
        const userLists = response.data.filter(list => list.user_id === user.id);
        setMylists(userLists);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des listes personnelles', err);
        if (err.response) {
          console.error('Détails de l\'erreur:', err.response.data);
        }
        setError('Impossible de charger vos listes personnelles. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyLists();
  }, [user]);

  /**
   * 🇬🇧 Filter lists based on search term
   * 
   * 🇫🇷 Filtrer les listes en fonction du terme de recherche
   */
  const filteredLists = mylists.filter(list => 
    list.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <main className="container py-5">
        {/* En-tête avec titre */}
        <div>
          <h1 className="title-swim display-6 fw-bold">Mes Listes</h1>
        </div>
        
        {/* Bouton d'ajout */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <p>Mes Favoris</p>
          <Link to="/user/mylists/new" className="btn btn btn-success">
            <FaPlus className="me-2" /> Ajouter Une Liste
          </Link>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Carte principale */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            {/* Barre de recherche */}
            <div className="input-group mb-3">
              <span className="input-group-text"><FaSearch /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher une liste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 
              🇬🇧 Conditional rendering based on loading state and lists availability
              🇫🇷 Affichage conditionnel selon l'état de chargement et la disponibilité des listes 
            */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Chargement de vos listes personnelles...</p>
              </div>
            ) : filteredLists.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredLists.map((list) => (
                  <div key={list.id} className="col">
                    <div className="card h-100 hover-lift">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div className="rounded-circle bg-primary-subtle p-3 me-3">
                            <FaSwimmingPool className="text-primary" />
                          </div>
                          <h2 className="card-title h5 mb-0">{list.title}</h2>
                        </div>
                        {list.description && (
                          <p className="card-text text-muted small">
                            {list.description.length > 100
                              ? `${list.description.substring(0, 100)}...`
                              : list.description}
                          </p>
                        )}
                        <div className="mt-3">
                          <Link
                            to={`/user/mylists/${list.id}`}
                            className="btn btn btn-secondary w-100"
                          >
                            Voir le détail
                          </Link>
                        </div>
                      </div>
                      <div className="card-footer bg-white">
                        <small className="text-muted">
                          Créée le {new Date(list.created_at).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Message quand aucune liste n'est trouvée */
              <div className="text-center py-5">
                <FaSwimmer className="text-muted fs-1 mb-3" />
                <p className="text-muted">
                  {searchTerm
                    ? "Aucune liste ne correspond à votre recherche."
                    : "Vous n'avez pas encore créé de liste personnelle."}
                </p>
                <Link to="/user/mylists/new" className="btn btn-primary">
                  <FaPlus className="me-2" /> Créer ma première liste
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

/**
 * 🇬🇧 Export the component for use in the application
 * 
 * 🇫🇷 Exporter le composant pour l'utiliser dans l'application
 */
export default UserMyLists;