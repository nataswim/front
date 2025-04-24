/**
 * 🇬🇧 FitnessCalculator component for calculating various fitness metrics
 * 🇫🇷 Composant FitnessCalculator pour calculer différentes métriques de fitness (version Bootstrap/CSS améliorée)
 */

import React, { useState } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import { FaHeartbeat, FaWeight, FaRulerVertical, FaRunning } from 'react-icons/fa';

const FitnessCalculator = () => {
  const [formValues, setFormValues] = useState({
    age: '', restingHeartRate: '', intensity: '', weight: '', height: '', formula: 'asstrand'
  });

  const [results, setResults] = useState({ hrr: 0, targetHr: 0, bmi: 0 });

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormValues({ age: '', restingHeartRate: '', intensity: '', weight: '', height: '', formula: 'asstrand' });
    setResults({ hrr: 0, targetHr: 0, bmi: 0 });
  };

  const calculateMaxHr = (age) => formValues.formula === 'asstrand' ? 220 - age : 208 - (0.7 * age);

  const calculateHrr = () => {
    const age = parseFloat(formValues.age);
    const restingHr = parseFloat(formValues.restingHeartRate);
    if (isNaN(age) || isNaN(restingHr)) return;
    const maxHr = calculateMaxHr(age);
    setResults(prev => ({ ...prev, hrr: maxHr - restingHr }));
  };

  const calculateTargetHr = () => {
    const intensity = parseFloat(formValues.intensity) / 100;
    const restingHr = parseFloat(formValues.restingHeartRate);
    if (isNaN(intensity) || isNaN(restingHr) || results.hrr === 0) return;
    setResults(prev => ({ ...prev, targetHr: (results.hrr * intensity) + restingHr }));
  };

  const calculateBmi = () => {
    const weight = parseFloat(formValues.weight);
    const height = parseFloat(formValues.height) / 100;
    if (isNaN(weight) || isNaN(height)) return;
    setResults(prev => ({ ...prev, bmi: weight / (height * height) }));
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5 text-success">Calculateur Fitness</h1>
          <p className="text-muted">Calculez votre Fréquence Cardiaque Cible, votre FCr et votre IMC en quelques secondes</p>
        </div>

        <form className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Âge (années)</label>
            <input type="number" name="age" className="form-control" value={formValues.age} onChange={handleInputChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">FC repos (bpm)</label>
            <input type="number" name="restingHeartRate" className="form-control" value={formValues.restingHeartRate} onChange={handleInputChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Intensité (%)</label>
            <input type="number" name="intensity" className="form-control" value={formValues.intensity} onChange={handleInputChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Poids (kg)</label>
            <input type="number" name="weight" className="form-control" value={formValues.weight} onChange={handleInputChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Taille (cm)</label>
            <input type="number" name="height" className="form-control" value={formValues.height} onChange={handleInputChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Formule FC max</label>
            <select name="formula" className="form-select" value={formValues.formula} onChange={handleInputChange}>
              <option value="asstrand">Asstrand (220 - âge)</option>
              <option value="tanaka">Tanaka (208 - 0.7 × âge)</option>
            </select>
          </div>
        </form>

        <div className="row g-3 mt-4">
          <div className="col-md-3">
            <button onClick={calculateHrr} className="btn btn-outline-primary w-100">Calculer FCr</button>
          </div>
          <div className="col-md-3">
            <button onClick={calculateTargetHr} className="btn btn-outline-success w-100">Calculer FC cible</button>
          </div>
          <div className="col-md-3">
            <button onClick={calculateBmi} className="btn btn-outline-info w-100">Calculer IMC</button>
          </div>
          <div className="col-md-3">
            <button onClick={handleReset} className="btn btn-outline-danger w-100">Réinitialiser</button>
          </div>
        </div>

        <div className="mt-5 row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <FaRunning size={24} className="text-primary mb-2" />
                <h5 className="card-title">FCr (HRR)</h5>
                <p className="card-text fw-bold mb-0">{results.hrr.toFixed(2)} bpm</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <FaHeartbeat size={24} className="text-danger mb-2" />
                <h5 className="card-title">FC cible (Target HR)</h5>
                <p className="card-text fw-bold mb-0">{results.targetHr.toFixed(2)} bpm</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <FaWeight size={24} className="text-info mb-2" />
                <h5 className="card-title">IMC (BMI)</h5>
                <p className="card-text fw-bold mb-0">{results.bmi.toFixed(2)} kg/m²</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FitnessCalculator;