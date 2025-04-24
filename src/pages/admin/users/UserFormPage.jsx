import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, createUser, updateUser } from '../../../services/users';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { getRoles } from '../../../services/roles';

const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  
  // Initialisez le formulaire avec des champs vides
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '',
  });

  const isEditMode = !!id;

  // Récupérer les rôles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', error);
        setError('Impossible de récupérer les rôles. Veuillez réessayer plus tard.');
      }
    };
  
    fetchRoles();
  }, []);

  // Récupérer les données de l'utilisateur UNIQUEMENT en mode édition
  useEffect(() => {
    // Assurez-vous que nous sommes en mode édition ET que l'ID est valide
    if (isEditMode && id) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await getUser(id);
          const userData = response.data;
          
          setFormData({
            username: userData.username || '',
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
            password: '', // Ne pas afficher le mot de passe existant
            role_id: userData.role_id?.toString() || '',
          });
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          setError('Impossible de récupérer les données de l\'utilisateur. Veuillez réessayer plus tard.');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      // En mode création, réinitialiser le formulaire
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role_id: '',
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      const submitData = { ...formData };

      // Si le mot de passe est vide en mode édition, ne pas l'envoyer
      if (isEditMode && !formData.password) {
        delete submitData.password;
      }

      if (isEditMode) {
        response = await updateUser(id, submitData);
      } else {
        response = await createUser(submitData);
      }

      alert(isEditMode 
        ? `L'utilisateur ${formData.username} a été mis à jour avec succès.` 
        : `L'utilisateur ${formData.username} a été créé avec succès.`);

      navigate('/admin/users');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction de réinitialisation du formulaire
  const resetForm = () => {
    setFormData({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role_id: '',
    });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-4">
        <button 
          className="btn btn-outline-primary" 
          onClick={() => navigate('/admin/users')}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
        
        {/* Bouton de réinitialisation du formulaire */}
        {!isEditMode && (
          <button 
            className="btn btn-outline-secondary" 
            onClick={resetForm}
            type="button"
          >
            Réinitialiser le formulaire
          </button>
        )}
      </div>

      <div className="card shadow mx-auto" style={{ maxWidth: '800px' }}>
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">{isEditMode ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}</h5>
          <p className="card-text text-muted small">
            {isEditMode 
              ? 'Modifiez les informations de l\'utilisateur' 
              : 'Créez un nouvel utilisateur dans le système'}
          </p>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="first_name" className="form-label">Prénom</label>
                <input
                  type="text"
                  className="form-control"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Prénom"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="last_name" className="form-label">Nom</label>
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Nom"
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                {isEditMode ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required={!isEditMode}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="role_id" className="form-label">Rôle</label>
              <select
                className="form-select"
                id="role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un rôle</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id.toString()}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enregistrement...
                  </span>
                ) : (
                  <span>
                    <FaSave className="me-2" />
                    {isEditMode ? 'Mettre à jour' : 'Créer l\'utilisateur'}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormPage;