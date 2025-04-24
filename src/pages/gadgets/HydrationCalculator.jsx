/**
 * 🇬🇫 Hydration Needs Calculator
 * 🇫🇷 Calculateur de besoins hydriques quotidiens (Bootstrap)
 */

import React, { useState } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const HydrationCalculator = () => {
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('');
  const [hydration, setHydration] = useState(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const a = parseFloat(activity);
    if (!isNaN(w)) {
      // Recommandation générale : 35 ml par kg + 500ml par heure d'activité physique
      const dailyLiters = (w * 35 + (a * 500)) / 1000;
      setHydration(Math.round(dailyLiters * 10) / 10);
    }
  };

  const reset = () => {
    setWeight('');
    setActivity('');
    setHydration(null);
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <h1 className="text-center fw-bold mb-4">Calculateur d'Hydratation Quotidienne</h1>
        <p className="text-center text-muted">Estimez vos besoins quotidiens en eau selon votre poids et votre activité physique</p>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Poids (kg)</label>
            <input type="number" className="form-control" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Activité physique (heures/jour)</label>
            <input type="number" className="form-control" value={activity} onChange={(e) => setActivity(e.target.value)} step="0.1" />
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <button className="btn btn-primary w-100" onClick={calculate}>Calculer</button>
          </div>
          <div className="col-md-6">
            <button className="btn btn-outline-secondary w-100" onClick={reset}>Réinitialiser</button>
          </div>
        </div>

        {hydration !== null && (
          <div className="alert alert-info text-center mt-4">
            Vous devriez boire environ <strong>{hydration} litres</strong> d'eau par jour.
          </div>
        )}

        <div className="card mt-4">
          <div className="card-header bg-light fw-bold">Recommandations générales</div>
          <div className="card-body">
            <ul>
              <li>En moyenne, une personne a besoin de 30 à 40 ml d'eau par kg de poids corporel.</li>
              <li>Ajoutez environ 500 ml pour chaque heure d'activité physique modérée à intense.</li>
              <li>Les besoins peuvent varier selon le climat, la température, l'âge et la santé.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HydrationCalculator;
