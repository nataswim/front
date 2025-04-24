/**
 * 🇬🇫 Kcal ↔️ Macronutrient Converter
 * 🇫🇷 Convertisseur kcal ↔ macronutriments (glucides, protéines, lipides)
 */

import React, { useState } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const KcalMacroConverter = () => {
  const [mode, setMode] = useState('kcalToMacros');
  const [form, setForm] = useState({ kcal: '', protein: '', fat: '', carb: '' });
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const convert = () => {
    const { kcal, protein, fat, carb } = form;
    if (mode === 'kcalToMacros') {
      const k = parseFloat(kcal);
      if (!isNaN(k)) {
        const p = Math.round((k * 0.25) / 4);
        const f = Math.round((k * 0.25) / 9);
        const c = Math.round((k * 0.5) / 4);
        setResult({ protein: p, fat: f, carb: c });
      }
    } else {
      const p = parseFloat(protein);
      const f = parseFloat(fat);
      const c = parseFloat(carb);
      if (!isNaN(p) && !isNaN(f) && !isNaN(c)) {
        const total = p * 4 + f * 9 + c * 4;
        setResult({ kcal: total });
      }
    }
  };

  const reset = () => {
    setForm({ kcal: '', protein: '', fat: '', carb: '' });
    setResult(null);
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <h1 className="text-center fw-bold mb-4">Convertisseur kcal ↔ Macronutriments</h1>

        <div className="mb-3">
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="mode" id="mode1" checked={mode === 'kcalToMacros'} onChange={() => setMode('kcalToMacros')} />
            <label className="form-check-label" htmlFor="mode1">kcal → macros</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="mode" id="mode2" checked={mode === 'macrosToKcal'} onChange={() => setMode('macrosToKcal')} />
            <label className="form-check-label" htmlFor="mode2">macros → kcal</label>
          </div>
        </div>

        <div className="row g-3 mb-4">
          {mode === 'kcalToMacros' ? (
            <div className="col-md-6">
              <label className="form-label">Énergie (kcal)</label>
              <input type="number" name="kcal" value={form.kcal} onChange={handleChange} className="form-control" />
            </div>
          ) : (
            <>
              <div className="col-md-4">
                <label className="form-label">Protéines (g)</label>
                <input type="number" name="protein" value={form.protein} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Lipides (g)</label>
                <input type="number" name="fat" value={form.fat} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Glucides (g)</label>
                <input type="number" name="carb" value={form.carb} onChange={handleChange} className="form-control" />
              </div>
            </>
          )}
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <button className="btn btn-primary w-100" onClick={convert}>Convertir</button>
          </div>
          <div className="col-md-6">
            <button className="btn btn-outline-secondary w-100" onClick={reset}>Réinitialiser</button>
          </div>
        </div>

        {result && (
          <div className="alert alert-info text-center mt-4">
            {mode === 'kcalToMacros' ? (
              <>
                Environ : <strong>{result.protein} g</strong> protéines, <strong>{result.fat} g</strong> lipides, <strong>{result.carb} g</strong> glucides.
              </>
            ) : (
              <>Total estimé : <strong>{result.kcal} kcal</strong></>
            )}
          </div>
        )}

        <div className="card mt-4">
          <div className="card-header bg-light fw-bold">Rappels nutritionnels</div>
          <div className="card-body">
            <ul>
              <li>1g de protéine = 4 kcal</li>
              <li>1g de glucide = 4 kcal</li>
              <li>1g de lipide = 9 kcal</li>
              <li>Répartition classique : 25% prot, 25% lipides, 50% glucides</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default KcalMacroConverter;
