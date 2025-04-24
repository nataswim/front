import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaArrowLeft, 
  FaPaperPlane 
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      // Appel à l'API d'authentification
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.');
      } else {
        setError(data.message || 'Impossible de traiter votre demande');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Erreur de mot de passe oublié', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header isAuthenticated={false} />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <div className="d-flex align-items-center mb-4">
                  <button 
                    onClick={() => navigate('/login')} 
                    className="btn btn-link text-muted me-3 p-0"
                  >
                    <FaArrowLeft className="fs-4" />
                  </button>
                  <h2 className="card-title mb-0 fw-bold">
                    Mot de passe oublié
                  </h2>
                </div>

                <p className="text-muted mb-4">
                  Entrez votre adresse email. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="alert alert-success" role="alert">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        placeholder="Adresse email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                      disabled={isLoading}
                    >
                      <FaPaperPlane className="me-2" />
                      {isLoading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3">
                  <p className="small text-muted">
                    Vous vous souvenez de votre mot de passe ? {' '}
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

export default ForgotPasswordPage;