/**
 * 🇬🇧 One Repetition Max (1RM) Calculator with percentage chart
 * 🇫🇷 Calculateur de 1 répétition maximale (1RM) avec tableau de pourcentages (Bootstrap/CSS version)
 */

import React, { useState, useCallback } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const percentageTable = [
  { reps: 1, percentage: 100 },
  { reps: 2, percentage: 95 },
  { reps: 3, percentage: 90 },
  { reps: 4, percentage: 88 },
  { reps: 5, percentage: 86 },
  { reps: 6, percentage: 85 },
  { reps: 7, percentage: 82 },
  { reps: 8, percentage: 80 },
  { reps: 9, percentage: 78 },
  { reps: 10, percentage: 75 },
  { reps: 11, percentage: 73 },
  { reps: 12, percentage: 70 },
  { reps: 13, percentage: 68 },
  { reps: 14, percentage: 66 },
  { reps: 15, percentage: 64 },
  { reps: 20, percentage: 60 }
];

const OneRMCalculator = () => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRM, setOneRM] = useState(null);

  const calculateOneRM = useCallback((e) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    const repsNum = parseFloat(reps);
    if (weightNum > 0 && repsNum > 0) {
      const result = weightNum * (1 + 0.025 * repsNum);
      setOneRM(Math.round(result * 100) / 100);
    }
  }, [weight, reps]);

  return (
    <>
      <Header />
      <main className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5 text-primary">Calculateur 1RM (Charge Max)</h1>
          <p className="text-muted">Estimez votre charge maximale à 1 répétition et découvrez les charges associées aux pourcentages standards</p>
        </div>

        <form onSubmit={calculateOneRM} className="row g-3 mb-4">
          <div className="col-md-6">
            <label htmlFor="weight" className="form-label">Poids soulevé (kg)</label>
            <input
              type="number"
              id="weight"
              className="form-control"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0"
              step="0.5"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="reps" className="form-label">Nombre de répétitions</label>
            <input
              type="number"
              id="reps"
              className="form-control"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              min="1"
              max="20"
              required
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Calculer 1RM</button>
          </div>
        </form>

        {oneRM !== null && (
          <div className="alert alert-success text-center fw-semibold">
            Votre 1RM estimé : {oneRM} kg
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-header fw-bold bg-light">Tableau des pourcentages</div>
          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th>Répétitions</th>
                  <th>% 1RM</th>
                  {oneRM !== null && <th>Poids (kg)</th>}
                </tr>
              </thead>
              <tbody>
                {percentageTable.map(({ reps, percentage }) => (
                  <tr key={reps}>
                    <td>{reps}</td>
                    <td>{percentage}%</td>
                    {oneRM !== null && (
                      <td>{Math.round((oneRM * percentage) / 100 * 100) / 100}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OneRMCalculator;
