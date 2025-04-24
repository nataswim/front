import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaShieldAlt 
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const navigate = useNavigate();
  const { register } = useAuth();

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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(username, email, password);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur d\'inscription');
    } finally {
      setIsLoading(false);
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
                  {/* Nom d'utilisateur */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Nom d'utilisateur
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control"
                        placeholder="Choisissez un nom d'utilisateur"
                        required
                      />
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Entrez votre email"
                        required
                      />
                    </div>
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
                        value={password}
                        onChange={handlePasswordChange}
                        className="form-control"
                        placeholder="Créez un mot de passe"
                        required
                        minLength="8"
                      />
                    </div>
                    {password && (
                      <div className="progress mt-1" style={{height: '4px'}}>
                        <div 
                          className={`progress-bar ${
                            passwordStrength === 1 ? 'bg-danger w-25' :
                            passwordStrength === 2 ? 'bg-warning w-50' :
                            passwordStrength === 3 ? 'bg-info w-75' :
                            passwordStrength >= 4 ? 'bg-success w-100' : 'bg-secondary'
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                      disabled={isLoading}
                    >
                      <FaUser className="me-2" />
                      {isLoading ? 'Inscription...' : 'S\'inscrire'}
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