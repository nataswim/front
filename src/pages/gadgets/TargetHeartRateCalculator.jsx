/**
 * 🇬🇫 Target Heart Rate Zone Calculator (THR)
 * 🇫🇷 Calculateur de Fréquence Cardiaque Cible par Zones (Bootstrap)
 */

import React, { useState } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const TargetHeartRateCalculator = () => {
  const [form, setForm] = useState({ age: '', restingHr: '' });
  const [zones, setZones] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateZones = () => {
    const age = parseInt(form.age);
    const resting = parseInt(form.restingHr);
    if (isNaN(age) || isNaN(resting)) return;

    const maxHr = 220 - age;
    const hrr = maxHr - resting;

    const zonePercentages = [
      { name: 'Zone 1 – Récupération', min: 0.5, max: 0.6 },
      { name: 'Zone 2 – Endurance fondamentale', min: 0.6, max: 0.7 },
      { name: 'Zone 3 – Endurance active', min: 0.7, max: 0.8 },
      { name: 'Zone 4 – Seuil', min: 0.8, max: 0.9 },
      { name: 'Zone 5 – Haute intensité', min: 0.9, max: 1.0 },
    ];

    const result = zonePercentages.map(zone => ({
      ...zone,
      bpmMin: Math.round(hrr * zone.min + resting),
      bpmMax: Math.round(hrr * zone.max + resting)
    }));

    setZones(result);
  };

  const reset = () => {
    setForm({ age: '', restingHr: '' });
    setZones(null);
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <h1 className="text-center fw-bold mb-4">Calculateur Zones de Fréquence Cardiaque</h1>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Âge</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} className="form-control" min="10" />
          </div>
          <div className="col-md-6">
            <label className="form-label">FC au repos (bpm)</label>
            <input type="number" name="restingHr" value={form.restingHr} onChange={handleChange} className="form-control" min="30" />
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <button onClick={calculateZones} className="btn btn-primary w-100">Calculer</button>
          </div>
          <div className="col-md-6">
            <button onClick={reset} className="btn btn-outline-secondary w-100">Réinitialiser</button>
          </div>
        </div>

        {zones && (
          <div className="card mt-4">
            <div className="card-header bg-light fw-bold">Zones Cardiaques</div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Zone</th>
                    <th>% FC réserve</th>
                    <th>Fréquence (bpm)</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone, index) => (
                    <tr key={index}>
                      <td>{zone.name}</td>
                      <td>{Math.round(zone.min * 100)}% - {Math.round(zone.max * 100)}%</td>
                      <td>{zone.bpmMin} - {zone.bpmMax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default TargetHeartRateCalculator;
