/**
 * 🇬🇫 React component: Calorie & Macronutrient Calculator
 * 🇫🇷 Composant React : Calculateur de calories & macronutriments (Bootstrap)
 */

import React, { useState } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const activityRatios = {
  Sédentaire: 1.2,
  "Peu actif": 1.375,
  "Moyennement actif": 1.55,
  Actif: 1.725,
  "Très actif": 1.9
};

const goalRatios = {
  "Remise en forme": 1,
  "Gain musculaire": 1.1,
  "Se tonifier": 0.9,
  "Améliorer l'endurance": 1.1,
  "Perdre du poids": 0.8
};

const proteinRatios = {
  "Remise en forme": { Sédentaire: 0.83, "Peu actif": 1.2, "Moyennement actif": 1.3, Actif: 1.6, "Très actif": 1.7 },
  "Gain musculaire": { Sédentaire: 0.83, "Peu actif": 1.6, "Moyennement actif": 1.8, Actif: 1.9, "Très actif": 2 },
  "Se tonifier": { Sédentaire: 0.83, "Peu actif": 1.3, "Moyennement actif": 1.6, Actif: 1.7, "Très actif": 1.8 },
  "Améliorer l'endurance": { Sédentaire: 0.83, "Peu actif": 1.6, "Moyennement actif": 1.8, Actif: 1.9, "Très actif": 2 },
  "Perdre du poids": { Sédentaire: 0.83, "Peu actif": 1.3, "Moyennement actif": 1.6, Actif: 1.7, "Très actif": 1.8 }
};

const fatRatios = {
  "Remise en forme": 0.2,
  "Gain musculaire": 0.25,
  "Se tonifier": 0.25,
  "Améliorer l'endurance": 0.25,
  "Perdre du poids": 0.25
};

const CalorieCalculator = () => {
  const [form, setForm] = useState({ age: '', weight: '', height: '', gender: 'male', activity: '', goal: '' });
  const [results, setResults] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const calculate = () => {
    const { age, weight, height, gender, activity, goal } = form;
    const ageNum = parseInt(age), weightNum = parseFloat(weight), heightNum = parseFloat(height);
    if (!activity || !goal || isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) return;

    const bmr = gender === 'male'
      ? 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
      : 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;

    const activityRatio = activityRatios[activity];
    const goalRatio = goalRatios[goal];
    const tdee = bmr * activityRatio * goalRatio;

    const proteinPerKg = proteinRatios[goal][activity];
    const proteinGrams = proteinPerKg * weightNum;
    const fatGrams = fatRatios[goal] * weightNum;
    const proteinCals = proteinGrams * 4;
    const fatCals = fatGrams * 9;
    const carbsCals = tdee - (proteinCals + fatCals);
    const carbsGrams = carbsCals / 4;

    const proteinPct = (proteinCals / tdee) * 100;
    const fatPct = (fatCals / tdee) * 100;
    const carbsPct = (carbsCals / tdee) * 100;

    setResults({ tdee, proteinGrams, fatGrams, carbsGrams, proteinPct, fatPct, carbsPct });
  };

  const reset = () => {
    setForm({ age: '', weight: '', height: '', gender: 'male', activity: '', goal: '' });
    setResults(null);
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <h1 className="text-center fw-bold mb-4">Calculateur de Besoins Caloriques</h1>
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Âge</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} className="form-control" min="10" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Poids (kg)</label>
            <input type="number" name="weight" value={form.weight} onChange={handleChange} className="form-control" min="20" step="0.1" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Taille (cm)</label>
            <input type="number" name="height" value={form.height} onChange={handleChange} className="form-control" min="100" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Sexe</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="form-select">
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Niveau d'activité</label>
            <select name="activity" value={form.activity} onChange={handleChange} className="form-select">
              <option value="">-- Sélectionner --</option>
              {Object.keys(activityRatios).map(key => <option key={key}>{key}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label">Objectif</label>
            <select name="goal" value={form.goal} onChange={handleChange} className="form-select">
              <option value="">-- Sélectionner --</option>
              {Object.keys(goalRatios).map(key => <option key={key}>{key}</option>)}
            </select>
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

        {results && (
          <div className="mt-5">
            <h3 className="text-center">Vos Résultats</h3>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Calories journalières estimées : <strong>{Math.round(results.tdee)} kcal</strong></li>
              <li className="list-group-item">Protéines : <strong>{Math.round(results.proteinGrams)} g</strong></li>
              <li className="list-group-item">Lipides : <strong>{Math.round(results.fatGrams)} g</strong></li>
              <li className="list-group-item">Glucides : <strong>{Math.round(results.carbsGrams)} g</strong></li>
            </ul>
            <div className="mt-4">
              <div className="progress">
                <div className="progress-bar bg-success" style={{ width: `${results.proteinPct.toFixed(0)}%` }}>Prot: {results.proteinPct.toFixed(0)}%</div>
                <div className="progress-bar bg-warning text-dark" style={{ width: `${results.fatPct.toFixed(0)}%` }}>Lip: {results.fatPct.toFixed(0)}%</div>
                <div className="progress-bar bg-info" style={{ width: `${results.carbsPct.toFixed(0)}%` }}>Gluc: {results.carbsPct.toFixed(0)}%</div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default CalorieCalculator;
