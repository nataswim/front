import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaStopwatch, FaHeartbeat, FaMapMarkedAlt, FaSwimmer, FaDumbbell, FaRunning, FaWater,
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const toolCategories = [
  {
    title: 'Natation & Triathlon',
    tools: [
      {
        path: '/outils/prediction-performance-natation',
        icon: <FaSwimmer className="me-2 text-primary" size={20} />,
        label: 'Prédiction Performance Natation'
      },
      {
        path: '/outils/chronometre-groupe',
        icon: <FaStopwatch className="me-2 text-warning" size={20} />,
        label: 'Chronomètre de Groupe'
      },
      {
        path: '/outils/planificateur-natation',
        icon: <FaSwimmer className="me-2 text-primary" size={20} />,
        label: 'Planificateur Natation'
      },
      {
        path: '/outils/planificateur-triathlon',
        icon: <FaRunning className="me-2 text-warning" size={20} />,
        label: 'Planificateur Triathlon'
      }
    ]
  },
  {
    title: 'Course à pied',
    tools: [
      {
        path: '/outils/planificateur-course',
        icon: <FaRunning className="me-2 text-primary" size={20} />,
        label: 'Planificateur Course à pied'
      }
    ]
  },
  {
    title: 'Suivi & calculs fitness',
    tools: [
      {
        path: '/outils/calculateur-charge-maximale',
        icon: <FaDumbbell className="me-2 text-danger" size={20} />,
        label: 'Calculateur de Charge Maximale (1RM)'
      },
      {
        path: '/outils/calculateur-calories-sport',
        icon: <FaHeartbeat className="me-2 text-success" size={20} />,
        label: 'Calculateur de Besoins Caloriques'
      },
      {
        path: '/outils/convertisseur-kcal-macros',
        icon: <FaDumbbell className="me-2 text-info" size={20} />,
        label: 'Convertisseur kcal/macros'
      },
      {
        path: '/outils/calculateur-imc',
        icon: <FaHeartbeat className="me-2 text-info" size={20} />,
        label: 'Calculateur d\'IMC'
      },
      {
        path: '/outils/calculateur-tdee',
        icon: <FaHeartbeat className="me-2 text-primary" size={20} />,
        label: 'Calculateur TDEE'
      },
      {
        path: '/outils/calculateur-masse-grasse',
        icon: <FaHeartbeat className="me-2 text-danger" size={20} />,
        label: 'Calculateur Masse Grasse'
      },
      {
        path: '/outils/calculateur-hydratation',
        icon: <FaHeartbeat className="me-2 text-info" size={20} />,
        label: "Calculateur d'Hydratation"
      },
      {
        path: '/outils/calculateur-fc-zones',
        icon: <FaHeartbeat className="me-2 text-warning" size={20} />,
        label: 'Calculateur FC par zone'
      }
    ]
  },
  {
    title: 'Outils divers',
    tools: [
      {
        path: '/outils/carte-interactive',
        icon: <FaMapMarkedAlt className="me-2 text-success" size={20} />,
        label: 'Carte Interactive'
      },
    ]
  }
];

const ToolsIndexPage = () => {
  return (
    <>
      <Header />
<section className="bg-primary text-white py-5">
          <div className="container py-4">
            <div className="row align-items-center">
              <div className="col-lg-7 mb-4 mb-lg-0">
                <div className="d-flex align-items-center mb-3">
                  <FaWater className="me-3 fs-1" />
                  <h1 className="display-4 fw-bold mb-0">Outils Sport Pour Tous</h1>
                </div>
                <p className="lead mb-4">
                Accédez rapidement à vos calculateurs, planificateurs et outils de suivi                </p>
                <Link to="/fonctionnalites" className="btn btn-light text-primary btn-lg px-4">
                  Plus de Fonctionnalités
                </Link>
              </div>
              <div className="col-lg-5 text-center">
                <div className="bg-white p-3 rounded shadow-sm">
                  <img src="/assets/images/banner/nataswim_app_banner_3.jpg" alt="Fonctionnalités de natation" className="img-fluid rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>


      <main className="container my-5">
       

        {toolCategories.map((category, i) => (
          <div key={i} className="mb-5">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light border-bottom">
                <h2 className="h5 fw-semibold mb-0">{category.title}</h2>
              </div>
              <div className="card-body py-4">
                <div className="row row-cols-1 row-cols-md-2 g-4">
                  {category.tools.map((tool, index) => (
                    <div className="col" key={index}>
                      <Link to={tool.path} className="text-decoration-none">
                        <div className="card h-100 shadow-sm border-0 bg-white hover-shadow">
                          <div className="card-body d-flex align-items-center">
                            <div className="me-3 fs-4">{tool.icon}</div>
                            <h5 className="card-title mb-0 text-dark">{tool.label}</h5>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
};

export default ToolsIndexPage;
