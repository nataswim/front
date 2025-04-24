/**
 * 🇬🇧 Swimming Performance Predictor with Bootstrap styling.
 * 🇫🇷 Prédicteur de performance en natation avec style Bootstrap.
 */

import React, { useState, useEffect } from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import { FaStopwatch, FaInfoCircle } from 'react-icons/fa';

const swimmingStyles = [
  { name: 'Crawl', distances: [100, 200, 400, 800, 1500] },
  { name: 'Papillon', distances: [100, 200] },
  { name: 'Brasse', distances: [100, 200] },
  { name: 'Dos', distances: [100, 200] },
  { name: 'Quatre Nages', distances: [200, 400] },
];

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const centiseconds = Math.round((timeInSeconds % 1) * 100);
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
};

const addFinalPercentage = (time) => time * 1.049;

const calculatePredictedTimes = (style, distance, bestTime50m, medleyTimes) => {
  const predictions = [];
  const time50m = bestTime50m;
  const time100m = addFinalPercentage((time50m + 1.5) + (time50m + 2.49));

  switch (style) {
    case 'Quatre Nages':
      const laps = [];
      if (distance === 200 && medleyTimes) {
        laps.push(
          { style: 'Papillon', time: parseFloat(medleyTimes.butterfly50m) + 2.2 },
          { style: 'Dos', time: parseFloat(medleyTimes.backstroke50m) + 3.09 },
          { style: 'Brasse', time: parseFloat(medleyTimes.breaststroke50m) + 5.59 },
          { style: 'Crawl', time: parseFloat(medleyTimes.freestyle50m) + 5.09 }
        );
      } else if (distance === 400 && medleyTimes) {
        laps.push(
          { style: 'Papillon', time: parseFloat(medleyTimes.butterfly100m) + 3.2 },
          { style: 'Dos', time: parseFloat(medleyTimes.backstroke100m) + 6.19 },
          { style: 'Brasse', time: parseFloat(medleyTimes.breaststroke100m) + 6 },
          { style: 'Crawl', time: parseFloat(medleyTimes.freestyle100m) + 8.97 }
        );
      }

      laps.forEach((lap, index) => {
        const final = index === laps.length - 1;
        const time = final ? addFinalPercentage(lap.time) : lap.time;
        predictions.push({
          distance: (index + 1) * (distance === 400 ? 100 : 50),
          time,
          timeFormatted: formatTime(time),
          label: `${lap.style} ${index + 1}${index === 0 ? 'er' : 'ème'} ${distance === 400 ? '100m' : '50m'}`
        });
      });
      break;

    default:
      if (distance === 100) {
        predictions.push(
          { distance: 50, time: time50m + 1.5, timeFormatted: formatTime(time50m + 1.5), label: '1er 50m' },
          { distance: 100, time: addFinalPercentage(time50m + 2.49), timeFormatted: formatTime(addFinalPercentage(time50m + 2.49)), label: '2ème 50m' }
        );
      } else if (distance === 200) {
        [2.5, 4.13, 4.53, 2.57].forEach((t, i) => {
          const lapTime = time50m + t;
          const isLast = i === 3;
          const time = isLast ? addFinalPercentage(lapTime) : lapTime;
          predictions.push({
            distance: (i + 1) * 50,
            time,
            timeFormatted: formatTime(time),
            label: `${i + 1}${i === 0 ? 'er' : 'ème'} 50m`
          });
        });
      } else if (distance === 400) {
        [4.5, 6.13, 6, 2.59].forEach((add, i) => {
          const lapTime = time100m + add;
          predictions.push({
            distance: (i + 1) * 100,
            time: i === 3 ? addFinalPercentage(lapTime) : lapTime,
            timeFormatted: formatTime(i === 3 ? addFinalPercentage(lapTime) : lapTime),
            label: `${i + 1}${i === 0 ? 'er' : 'ème'} 100m`
          });
        });
      }
      break;
  }

  return predictions;
};

const calculateTotalTime = (predictions) => {
  return predictions.reduce((total, pred) => total + pred.time, 0);
};

const SwimmingPerformancePredictor = () => {
  const [selectedStyle, setSelectedStyle] = useState(swimmingStyles[0].name);
  const [selectedDistance, setSelectedDistance] = useState(swimmingStyles[0].distances[0]);
  const [bestTime50m, setBestTime50m] = useState('');
  const [distance, setDistance] = useState(100);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [medleyTimes, setMedleyTimes] = useState({
    butterfly50m: '',
    backstroke50m: '',
    breaststroke50m: '',
    freestyle50m: '',
    butterfly100m: '',
    backstroke100m: '',
    breaststroke100m: '',
    freestyle100m: '',
  });

  const handleCalculate = () => {
    if (selectedStyle === 'Quatre Nages') {
      const keys = selectedDistance === 200
        ? ['butterfly50m', 'backstroke50m', 'breaststroke50m', 'freestyle50m']
        : ['butterfly100m', 'backstroke100m', 'breaststroke100m', 'freestyle100m'];

      const valid = keys.every(key => medleyTimes[key] && !isNaN(parseFloat(medleyTimes[key])));
      if (!valid) {
        setError(`Veuillez entrer tous les temps pour le ${selectedDistance}m Quatre Nages`);
        return;
      }

      const preds = calculatePredictedTimes(selectedStyle, selectedDistance, 0, medleyTimes);
      setPredictions(preds);
      setTotalTime(formatTime(calculateTotalTime(preds)));
      setError('');
      return;
    }

    const time = parseFloat(bestTime50m);
    if (isNaN(time) || time <= 0) {
      setError('Veuillez entrer un temps valide pour le 50m.');
      return;
    }

    const preds = calculatePredictedTimes(selectedStyle, distance, time);
    setPredictions(preds);
    setTotalTime(formatTime(calculateTotalTime(preds)));
    setError('');
  };

  useEffect(() => {
    const style = swimmingStyles.find(s => s.name === selectedStyle);
    if (style) {
      setSelectedDistance(style.distances[0]);
      setDistance(style.distances[0]);
    }
  }, [selectedStyle]);

  const handleMedleyTimeChange = (field, value) => {
    setMedleyTimes(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Header />
      <main className="container my-5">
        <div className="mb-4">
          <h2 className="d-flex align-items-center gap-2">
            <FaStopwatch /> Prédicteur de Performance Natation
          </h2>
          <div className="alert alert-info d-flex align-items-start mt-2">
            <FaInfoCircle className="me-2 mt-1" />
            <div>
              Cet outil estime vos temps intermédiaires sur différentes distances à partir de votre temps 50m ou des temps pour chaque nage.
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-semibold text-amber-900">Notes Importantes</h2>
        </div>
        <ul className="list-disc list-inside space-y-2 text-amber-900">
          <li>Ces formules sont des estimations et peuvent varier en fonction des nageurs.</li>
          <li>Elles supposent une progression constante et une endurance adaptée à chaque distance et chaque nage.</li>
          <li>Ces formules sont très utiles pour les entraîneurs et les nageurs pour estimer les temps de course en fonction des performances passées.</li>
          <li>Il est important de noter que pour le quatre nages, les calculs sont basés sur les temps des 50m ou 100m de chaque nage, selon la distance totale du quatre nages.</li>
        </ul>
      </div>

        <form className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Style de nage</label>
            <select className="form-select" value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
              {swimmingStyles.map(style => (
                <option key={style.name} value={style.name}>{style.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Distance</label>
            <select className="form-select" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))}>
              {swimmingStyles.find(s => s.name === selectedStyle)?.distances.map(d => (
                <option key={d} value={d}>{d}m</option>
              ))}
            </select>
          </div>

          {selectedStyle === 'Quatre Nages' ? (
            <>
              {Object.entries(medleyTimes)
                .filter(([key]) => key.includes(distance === 200 ? '50m' : '100m'))
                .map(([key, value]) => (
                  <div className="col-md-3" key={key}>
                    <label className="form-label">{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</label>
                    <input
                      type="number"
                      className="form-control"
                      value={value}
                      onChange={(e) => handleMedleyTimeChange(key, e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                ))}
            </>
          ) : (
            <div className="col-12">
              <label className="form-label">Temps 50m (en secondes)</label>
              <input
                type="number"
                className="form-control"
                value={bestTime50m}
                onChange={(e) => setBestTime50m(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          )}

          <div className="col-12">
            <button type="button" className="btn btn-primary w-100" onClick={handleCalculate}>
              Calculer mes temps
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {totalTime && (
          <div className="alert alert-success mt-3">
            Temps total estimé : <strong>{totalTime}</strong>
          </div>
        )}

        {predictions.length > 0 && (
          <div className="card mt-4">
            <div className="card-header">Détail des temps intermédiaires</div>
            <div className="card-body">
              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Fraction</th>
                    <th>Temps (formaté)</th>
                    <th>Temps brut (sec)</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p, index) => (
                    <tr key={index}>
                      <td>{p.label}</td>
                      <td><strong>{p.timeFormatted}</strong></td>
                      <td>{p.time.toFixed(2)}</td>
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

export default SwimmingPerformancePredictor;
