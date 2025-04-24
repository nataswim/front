import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import Header from "../../components/template/Header";
import Footer from "../../components/template/Footer";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(email, password);

      // Redirection basée sur le rôle
      if (response.user.role_id === 1) {
        console.log("Redirection admin vers /admin");
        navigate("/admin");
      } else {
        console.log("Redirection utilisateur vers /user/dashboard");
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header isAuthenticated={false} />

{/* Arrière-plan vidéo */}
<div className="video-background">
        <iframe 
          className="video-iframe"
          src="https://www.youtube.com/embed/AhBaSV8psGA?autoplay=1&mute=1&loop=1&playlist=AhBaSV8psGA&controls=0&showinfo=0&modestbranding=1"
          title="YouTube Video Background"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <h2 className="card-title text-center mb-4 fw-bold">
                  Connexion
                </h2>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Champ Email */}
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

                  {/* Champ Mot de passe */}
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
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Entrez votre mot de passe"
                        required
                      />
                    </div>
                  </div>

                  {/* Lien Mot de passe oublié */}
                  <div className="d-flex justify-content-end mb-3">
                    <Link
                      to="/forgot-password"
                      className="text-primary text-decoration-none small"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  {/* Bouton de connexion */}
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                      disabled={isLoading}
                    >
                      <FaSignInAlt className="me-2" />
                      {isLoading ? "Connexion..." : "Se connecter"}
                    </button>
                  </div>
                </form>

                {/* Lien d'inscription */}
                <div className="text-center">
                  <p className="small text-muted">
                    Pas de compte ?{" "}
                    <Link
                      to="/register"
                      className="text-primary text-decoration-none"
                    >
                      Créer un compte
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

export default LoginPage;
