import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import { 
  FaBook, 
  FaSwimmer, 
  FaDumbbell, 
  FaCalendarAlt, 
  FaList, 
  FaUserCog,
  FaFileUpload,
  FaCalculator,
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus,
  FaGavel,
  FaWater,
  FaTools
} from 'react-icons/fa';

/**
 * 🇬🇧 User Guide Page - This component displays a comprehensive guide for users
 * explaining how to use the main features of the application and providing links to all pages
 * 
 * 🇫🇷 Page Guide d'Utilisation - Ce composant affiche un guide complet pour les utilisateurs
 * expliquant comment utiliser les fonctionnalités principales de l'application et fournissant des liens vers toutes les pages
 */
const UserGuidePage = () => {
  // Assurez-vous que la page a le bon titre
  useEffect(() => {
    document.title = 'Guide d\'utilisation | NataSwim';
  }, []);
  
  return (
    <>
      <Header />

{/* Hero Section */}
        <section className="bg-primary text-white py-5">
          <div className="container py-4">
            <div className="row align-items-center">
              <div className="col-lg-7 mb-4 mb-lg-0">
                <div className="d-flex align-items-center mb-3">
                  <FaWater className="me-3 fs-1" />
                  <h1 className="display-4 fw-bold mb-0">Guide d'utilisation</h1>
                </div>
                <p className="lead mb-4">
                Tout ce que vous devez savoir pour tirer le meilleur parti de NataSwim'APP                </p>
                <Link to="/user" className="btn btn-light text-primary btn-lg px-4">
                  Mon Espace Perso
                </Link>
              </div>
              <div className="col-lg-5 text-center">
                <div className="bg-white p-3 rounded shadow-sm">
                  <img src="/assets/images/banner/nataswim_app_banner_1.jpg" alt="Fonctionnalités de natation" className="img-fluid rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Carnets d'entraînement section */}
      <div className="card shadow-sm mb-5">
        <div className="card-header">
          <h2 className="h3 mb-0">Créez et personnalisez vos carnets d'entraînement</h2>
        </div>
        <div className="card-body">
          <p className="card-text">
            Organisez efficacement vos programmes de natation en quelques étapes simples.
          </p>

          <div className="row mb-4">
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0">1 Création d'un carnet</h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">• Rendez-vous sur la page "Mes Carnets"</li>
                    <li className="list-group-item">• Attribuez un titre clair et pertinent</li>
                    <li className="list-group-item">• Ajoutez une description précise</li>
                    <li className="list-group-item">• Validez la création du carnet</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0"> 2 Personnalisation</h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">• Sélectionnez votre carnet créé</li>
                    <li className="list-group-item">• Cliquez sur "Ajouter des éléments"</li>
                    <li className="list-group-item">• Choisissez le type d'élément à ajouter</li>
                    <li className="list-group-item">• Sélectionnez et validez vos choix</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0">3 Gestion des carnets</h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">• Accédez à vos carnets 24h/24</li>
                    <li className="list-group-item">• Consultez ou modifiez vos carnets</li>
                    <li className="list-group-item">• Dupliquez pour créer des variantes</li>
                    <li className="list-group-item">• Supprimez les carnets non utilisés</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0">4 Points clés</h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">• Confidentialité garantie</li>
                    <li className="list-group-item">• Flexibilité selon vos objectifs</li>
                    <li className="list-group-item">• Bibliothèque complète disponible</li>
                    <li className="list-group-item">• Interface intuitive pour faciliter l'usage</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info">
            <h4 className="h5 mb-3"> + Conseils supplémentaires</h4>
            <ul className="mb-0">
              <li>Utilisez des titres précis pour retrouver facilement vos carnets.</li>
              <li>Dupliquez un carnet existant pour créer rapidement une nouvelle version.</li>
              <li>Organisez vos carnets par objectif ou niveau pour faciliter la navigation.</li>
              <li>N'hésitez pas à combiner des séances de différentes intensités dans un même carnet.</li>
            </ul>
          </div>

          <div className="text-center mt-4">
            <Link to="/user/mylists/new" className="btn btn-primary me-2">
              <FaList className="me-2" />
              Créer mon premier carnet
            </Link>
            <Link to="/user/mylists" className="btn btn-outline-primary">
              <FaBook className="me-2" />
              Mes carnets existants
            </Link>
          </div>
        </div>
      </div>

      {/* Exercices et séances section */}
      <div className="card shadow-sm mb-5">
        <div className="card-header bg-primary text-white">
          <h2 className="h3 mb-0">Exercices et séances d'entraînement</h2>
        </div>
        <div className="card-body">
          <p className="card-text">
            Consultez notre bibliothèque complète d'exercices et séances pour améliorer vos performances en natation.
          </p>

          <div className="row mb-4">
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0">
                    <FaDumbbell className="me-2" />
                    Trouver des exercices
                  </h3>
                </div>
                <div className="card-body">
                  <p>
                    Parcourez notre catalogue d'exercices spécifiques à la natation, filtrez par niveau, 
                    type de nage ou objectif d'entraînement.
                  </p>
                  <Link to="/educatifs-de-natation" className="btn btn-outline-primary btn-sm">
                    Accéder aux exercices
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0">
                    <FaSwimmer className="me-2" />
                    Trouver des séances
                  </h3>
                </div>
                <div className="card-body">
                  <p>
                    Séances personnalisées en combinant différents exercices, 
                     distances, répétitions et temps de repos.
                  </p>
                  <Link to="/seances-de-natation" className="btn btn-outline-primary btn-sm">
                    Voir les  séances d'entraînement
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-success">
            <h4 className="h5">Bon à savoir</h4>
            <p className="mb-0">
              Vous pouvez sauvegarder vos exercices et séances préférés dans vos listes personnelles 
              pour y accéder rapidement lors de vos prochains entraînements.
            </p>
          </div>
        </div>
      </div>

      {/* Plans d'entraînement */}
      <div className="card shadow-sm mb-5">
        <div className="card-header bg-primary text-white">
          <h2 className="h3 mb-0">
            <FaCalendarAlt className="me-2" />
            Plans d'entraînement
          </h2>
        </div>
        <div className="card-body">
          <p className="card-text">
            Suivez des plans d'entraînement complets adaptés à vos objectifs et à votre niveau.
          </p>

          <div className="row mb-4">
            <div className="col-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="h5 mb-3">Comment utiliser les plans d'entraînement :</h3>
                  <ol className="list-group list-group-numbered mb-4">
                    <li className="list-group-item">Parcourez les plans disponibles dans la bibliothèque</li>
                    <li className="list-group-item">Sélectionnez un plan adapté à votre niveau et objectif</li>
                    <li className="list-group-item">Ajoutez-le à vos favoris pour un accès rapide</li>
                    <li className="list-group-item">Suivez la progression semaine par semaine</li>
                    <li className="list-group-item">Gardez une trace de vos performances dans votre carnet</li>
                  </ol>
                  
                  <div className="d-flex justify-content-center">
                    <Link to="/plans-de-natation" className="btn btn-primary">
                      <FaCalendarAlt className="me-2" />
                      Découvrir les plans
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liens vers les pages du site */}
      <div className="card shadow-sm mb-5">
        <div className="card-header bg-primary text-white">
          <h2 className="h3 mb-0">Pages à la une</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0">
                    <FaUserCog className="me-2" />
                    Espace utilisateur
                  </h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <Link to="/user/dashboard" className="text-decoration-none">Mon Espace</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/user/profile" className="text-decoration-none">Mon profil</Link>
                    </li>
                  
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0">
                    <FaSwimmer className="me-2" />
                    Exercices et entraînements
                  </h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <Link to="/user/exercises" className="text-decoration-none">Tous les exercices</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/user/exercises/mes_exercices" className="text-decoration-none">Mes exercices</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/user/workouts" className="text-decoration-none">Séances d'entraînement</Link>
                    </li>
                  
                    <li className="list-group-item">
                      <Link to="/user/workouts/mes_seances" className="text-decoration-none">Mes séances</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0">
                    <FaCalendarAlt className="me-2" />
                    Plans et carnets
                  </h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <Link to="/user/plans" className="text-decoration-none">Tous les plans</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/user/plans/mes_plans" className="text-decoration-none">Mes plans</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/user/mylists" className="text-decoration-none">Mes carnets</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/user/mylists/new" className="text-decoration-none">Créer un carnet</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0">
                    <FaTools className="me-2" />
                    Outils et calculateurs
                  </h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <Link to="/outils" className="text-decoration-none">Tous les outils</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/outils/calculateur-imc" className="text-decoration-none">Calculateur IMC</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/outils/prediction-performance-natation" className="text-decoration-none">Prédicteur de performance</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/outils/calculateur-fc-zones" className="text-decoration-none">Zones de fréquence cardiaque</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/outils/calculateur-calories-sport" className="text-decoration-none">Calculateur de calories</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/outils/planificateur-natation" className="text-decoration-none">Planificateur natation</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0">
                    <FaHome className="me-2" />
                    Pages principales
                  </h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <Link to="/" className="text-decoration-none">Accueil</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/a-propos" className="text-decoration-none">À propos</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/contact" className="text-decoration-none">Contact</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/fonctionnalites" className="text-decoration-none">Fonctionnalités</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/plan-inscription" className="text-decoration-none">Plans d'inscription</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/articles" className="text-decoration-none">Articles</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/search" className="text-decoration-none">Recherche</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h3 className="h5 mb-0">
                    <FaGavel className="me-2" />
                    Pages légales et authentification
                  </h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <Link to="/mentions-legales" className="text-decoration-none">Mentions légales</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/politique-confidentialite" className="text-decoration-none">Politique de confidentialité</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/cookies" className="text-decoration-none">Politique des cookies</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/declaration-Accessibilite" className="text-decoration-none">Accessibilité</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/login" className="text-decoration-none">Connexion</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/register" className="text-decoration-none">Inscription</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Besoin d'aide section */}
      <div className="text-center mt-5 mb-5">
        <h2 className="h4 mb-4">Besoin d'aide supplémentaire ?</h2>
        <Link to="/contact" className="btn btn-lg btn-outline-primary">
          <FaEnvelope className="me-2" />
          Contactez notre équipe
        </Link>
        </div>
        <Footer />
≈    </>
  );
};

export default UserGuidePage;