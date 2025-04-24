/**
 * 🇬🇫 TDEE Calculator (Total Daily Energy Expenditure)
 * 🇫🇷 Calculateur de dépense énergétique journalière totale (TDEE) avec Bootstrap
 */

import React, { useState } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const activityLevels = {
  "Sédentaire (peu ou pas d'exercice)": 1.2,
  "Légèrement actif (1-3 j/semaine)": 1.375,
  "Modérément actif (3-5 j/semaine)": 1.55,
  "Actif (6-7 j/semaine)": 1.725,
  "Très actif (2x/jour ou travail physique)": 1.9
};

const TDEECalculator = () => {
  const [form, setForm] = useState({ age: '', weight: '', height: '', gender: 'male', activity: '' });
  const [tdee, setTdee] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const calculateTDEE = () => {
    const { age, weight, height, gender, activity } = form;
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const activityFactor = parseFloat(activity);

    if (!isNaN(w) && !isNaN(h) && !isNaN(a) && !isNaN(activityFactor)) {
      const bmr = gender === 'male'
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;
      setTdee(Math.round(bmr * activityFactor));
    }
  };

  const reset = () => {
    setForm({ age: '', weight: '', height: '', gender: 'male', activity: '' });
    setTdee(null);
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <h1 className="text-center fw-bold mb-4">Calculateur de TDEE</h1>
        <p className="text-center text-muted">Calculez votre dépense énergétique journalière totale selon votre métabolisme et votre activité</p>

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label">Âge</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Poids (kg)</label>
            <input type="number" name="weight" value={form.weight} onChange={handleChange} className="form-control" step="0.1" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Taille (cm)</label>
            <input type="number" name="height" value={form.height} onChange={handleChange} className="form-control" />
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
              {Object.entries(activityLevels).map(([label, value]) => (
                <option key={label} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <button className="btn btn-primary w-100" onClick={calculateTDEE}>Calculer</button>
          </div>
          <div className="col-md-6">
            <button className="btn btn-outline-secondary w-100" onClick={reset}>Réinitialiser</button>
          </div>
        </div>

        {tdee && (
          <div className="alert alert-success text-center mt-4">
            Votre TDEE est estimé à <strong>{tdee} kcal/jour</strong>
          </div>
        )}

        <div className="card mt-4">
          <div className="card-header bg-light fw-bold">Qu'est-ce que le TDEE ?</div>
          <div className="card-body">
            <p>Le TDEE (Total Daily Energy Expenditure) est le nombre de calories que votre corps dépense quotidiennement en fonction de votre métabolisme et de votre activité physique. Il permet de déterminer l'apport calorique nécessaire pour maintenir votre poids actuel.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TDEECalculator;
