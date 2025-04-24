/**
 * 🇬🇫 BMI Calculator (Body Mass Index)
 * 🇫🇷 Calculateur d'IMC (Indice de Masse Corporelle) avec Bootstrap
 */

import React, { useState } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const BMICalculator = () => {
  const [form, setForm] = useState({ weight: '', height: '' });
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCalculate = () => {
    const weight = parseFloat(form.weight);
    const height = parseFloat(form.height) / 100;
    if (!isNaN(weight) && !isNaN(height) && height > 0) {
      const result = weight / (height * height);
      setBmi(result);

      let status = '';
      if (result < 18.5) status = 'Insuffisance pondérale';
      else if (result < 25) status = 'Poids normal';
      else if (result < 30) status = 'Surpoids';
      else status = 'Obésité';
      setCategory(status);
    }
  };

  const handleReset = () => {
    setForm({ weight: '', height: '' });
    setBmi(null);
    setCategory('');
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <h1 className="text-center fw-bold mb-4">Calculateur d'IMC</h1>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Poids (kg)</label>
            <input type="number" name="weight" className="form-control" value={form.weight} onChange={handleChange} min="30" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Taille (cm)</label>
            <input type="number" name="height" className="form-control" value={form.height} onChange={handleChange} min="100" />
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <button className="btn btn-primary w-100" onClick={handleCalculate}>Calculer</button>
          </div>
          <div className="col-md-6">
            <button className="btn btn-outline-secondary w-100" onClick={handleReset}>Réinitialiser</button>
          </div>
        </div>

        {bmi && (
          <div className="alert alert-info text-center mt-4">
            Votre IMC est de <strong>{bmi.toFixed(1)}</strong> - <span className="fw-semibold">{category}</span>
          </div>
        )}

        <div className="card mt-5">
          <div className="card-header bg-light fw-bold">Interprétation de l'IMC</div>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">IMC &lt; 18.5 : Insuffisance pondérale</li>
              <li className="list-group-item">18.5 ≤ IMC &lt; 25 : Poids normal</li>
              <li className="list-group-item">25 ≤ IMC &lt; 30 : Surpoids</li>
              <li className="list-group-item">IMC ≥ 30 : Obésité</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BMICalculator;
