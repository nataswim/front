/**
 * 🇬🇫 Swimming Session Planner
 * 🇫🇷 Planificateur de séances hebdomadaires pour la natation (version Bootstrap)
 */

import React, { useState } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const SwimmingPlanner = () => {
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState('');
  const [sessions, setSessions] = useState(null);

  const plans = {
    'Remise en forme': { débutant: 2, intermédiaire: 3, avancé: 4 },
    "Améliorer l’endurance": { débutant: 3, intermédiaire: 4, avancé: 5 },
    "Perte de poids": { débutant: 2, intermédiaire: 3, avancé: 4 },
    "Préparation compétition": { débutant: 3, intermédiaire: 5, avancé: 6 }
  };

  const handleCalculate = () => {
    if (goal && experience) {
      setSessions(plans[goal][experience]);
    }
  };

  const reset = () => {
    setGoal('');
    setExperience('');
    setSessions(null);
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <h1 className="text-center fw-bold mb-4">Planificateur de Séances - Natation</h1>
        <p className="text-center text-muted">Estimez le nombre de séances hebdomadaires recommandées selon votre objectif et niveau</p>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Objectif</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} className="form-select">
              <option value="">-- Choisir un objectif --</option>
              {Object.keys(plans).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Niveau d'expérience</label>
            <select value={experience} onChange={(e) => setExperience(e.target.value)} className="form-select">
              <option value="">-- Sélectionner votre niveau --</option>
              <option value="débutant">Débutant</option>
              <option value="intermédiaire">Intermédiaire</option>
              <option value="avancé">Avancé</option>
            </select>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <button onClick={handleCalculate} className="btn btn-primary w-100">Générer mon plan</button>
          </div>
          <div className="col-md-6">
            <button onClick={reset} className="btn btn-outline-secondary w-100">Réinitialiser</button>
          </div>
        </div>

        {sessions && (
          <div className="alert alert-success text-center mt-4">
            Pour votre objectif <strong>{goal}</strong> et niveau <strong>{experience}</strong>,
            il est recommandé de nager <strong>{sessions} séances</strong> par semaine.
          </div>
        )}

        <div className="card mt-4">
          <div className="card-header bg-light fw-bold">Conseils natation</div>
          <div className="card-body">
            <ul>
              <li>Inclure : technique, endurance, sprint et récupération</li>
              <li>Bien s’échauffer avant chaque séance</li>
              <li>Prendre un jour de repos après 2 à 3 jours consécutifs</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SwimmingPlanner;
