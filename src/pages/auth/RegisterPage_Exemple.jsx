import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaShieldAlt 
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Calculer la force du mot de passe
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mise à jour de la force du mot de passe
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation des champs
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Validation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Vérification de la force du mot de passe
    if (passwordStrength < 3) {
      setError('Mot de passe trop faible. Utilisez des majuscules, minuscules, chiffres et caractères spéciaux.');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}`,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          role_id: formData.role === 'athlet' ? 3 : 2 // Mapping des rôles
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirection vers la page de connexion
        navigate('/login');
      } else {
        // Gestion des erreurs d'inscription
        setError(data.message || 'Échec de l\'inscription');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Erreur d\'inscription:', err);
    }
  };

  return (
    <>
      <Header isAuthenticated={false} />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <h2 className="card-title text-center mb-4 fw-bold">
                  Créer un compte
                </h2>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Prénom */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label">
                        Prénom
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Votre prénom"
                          required
                        />
                      </div>
                    </div>

                    {/* Nom */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label">
                        Nom
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Adresse email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Entrez votre email"
                        required
                      />
                    </div>
                  </div>

                  {/* Type de compte */}
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Type de compte
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="user">Utilisateur</option>
                      <option value="athlet">Athlète</option>
                    </select>
                  </div>

                  {/* Mot de passe */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Mot de passe
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Créez un mot de passe"
                        required
                        minLength="8"
                      />
                    </div>
                    {formData.password && (
                      <div className="progress mt-1" style={{height: '4px'}}>
                        <div 
                          className={`progress-bar ${
                            passwordStrength === 1 ? 'bg-danger w-25' :
                            passwordStrength === 2 ? 'bg-warning w-50' :
                            passwordStrength === 3 ? 'bg-info w-75' :
                            passwordStrength === 4 ? 'bg-success w-100' : 'bg-secondary'
                          }`}
                          role="progressbar"
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Confirmation mot de passe */}
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirmez le mot de passe
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaShieldAlt />
                      </span>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Confirmez votre mot de passe"
                        required
                        minLength="8"
                      />
                    </div>
                  </div>

                  {/* Bouton d'inscription */}
                  <div className="d-grid mb-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                    >
                      <FaUser className="me-2" />
                      S'inscrire
                    </button>
                  </div>
                </form>

                {/* Lien de connexion */}
                <div className="text-center">
                  <p className="small text-muted">
                    Vous avez déjà un compte ? {' '}
                    <Link 
                      to="/login" 
                      className="text-primary text-decoration-none"
                    >
                      Connectez-vous
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterPage;