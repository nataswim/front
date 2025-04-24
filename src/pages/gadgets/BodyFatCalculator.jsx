/**
 * 🇬🇫 Body Fat Percentage Calculator (US Navy method)
 * 🇫🇷 Calculateur de taux de masse grasse (formule US Navy)
 */

import React, { useState } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const BodyFatCalculator = () => {
  const [form, setForm] = useState({
    gender: 'male',
    age: '',
    height: '',
    neck: '',
    waist: '',
    hip: ''
  });
  const [fatPercent, setFatPercent] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const calculate = () => {
    const { gender, height, neck, waist, hip } = form;
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const hp = parseFloat(hip);

    if (gender === 'male' && h && n && w) {
      const bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
      setFatPercent(Math.round(bodyFat * 10) / 10);
    }

    if (gender === 'female' && h && n && w && hp) {
      const bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
      setFatPercent(Math.round(bodyFat * 10) / 10);
    }
  };

  const reset = () => {
    setForm({ gender: 'male', age: '', height: '', neck: '', waist: '', hip: '' });
    setFatPercent(null);
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <h1 className="text-center fw-bold mb-4">Calculateur de Masse Grasse (%)</h1>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Sexe</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="form-select">
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Âge</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} className="form-control" min="10" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Taille (cm)</label>
            <input type="number" name="height" value={form.height} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tour de cou (cm)</label>
            <input type="number" name="neck" value={form.neck} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tour de taille (cm)</label>
            <input type="number" name="waist" value={form.waist} onChange={handleChange} className="form-control" />
          </div>
          {form.gender === 'female' && (
            <div className="col-md-6">
              <label className="form-label">Tour de hanches (cm)</label>
              <input type="number" name="hip" value={form.hip} onChange={handleChange} className="form-control" />
            </div>
          )}
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <button className="btn btn-primary w-100" onClick={calculate}>Calculer</button>
          </div>
          <div className="col-md-6">
            <button className="btn btn-outline-secondary w-100" onClick={reset}>Réinitialiser</button>
          </div>
        </div>

        {fatPercent !== null && (
          <div className="alert alert-info text-center mt-4">
            Taux de masse grasse estimé : <strong>{fatPercent}%</strong>
          </div>
        )}

        <div className="card mt-4">
          <div className="card-header bg-light fw-bold">Méthode utilisée</div>
          <div className="card-body">
            <p>Ce calculateur utilise la formule officielle de la <strong>US Navy</strong>, basée sur la taille et les circonférences du corps pour estimer la composition corporelle.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BodyFatCalculator;
