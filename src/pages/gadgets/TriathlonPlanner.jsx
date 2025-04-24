/**
 * 🇬🇧 Triathlon Session Planner
 * 🇫🇷 Planificateur de séances hebdomadaires pour triathlon (version Bootstrap)
 */

import React, { useState } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const TriathlonPlanner = () => {
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState('');
  const [sessions, setSessions] = useState(null);

  const plans = {
    'Découverte / Sprint': { débutant: 3, intermédiaire: 4, avancé: 5 },
    'Distance Olympique': { débutant: 4, intermédiaire: 5, avancé: 6 },
    'Half Ironman (70.3)': { débutant: 5, intermédiaire: 6, avancé: 7 },
    'Ironman': { débutant: 6, intermédiaire: 7, avancé: 8 }
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
        <h1 className="text-center fw-bold mb-4">Planificateur de Séances - Triathlon</h1>
        <p className="text-center text-muted">Recommandation de volume d'entraînement hebdomadaire selon votre objectif et votre niveau</p>

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
            il est recommandé d’effectuer <strong>{sessions} séances</strong> par semaine.
          </div>
        )}

        <div className="card mt-4">
          <div className="card-header bg-light fw-bold">Conseils généraux</div>
          <div className="card-body">
            <ul>
              <li>Inclure variété : endurance, intensité, récupération</li>
              <li>Planifier les semaines de récupération active tous les 3-4 semaines</li>
              <li>Respecter les signaux de fatigue et adapter si nécessaire</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TriathlonPlanner;
