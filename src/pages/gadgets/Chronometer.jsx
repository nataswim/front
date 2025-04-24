/**
 * 🇬🇧 Interactive chronometer component with Bootstrap design enhancement.
 * 🇫🇷 Composant chronomètre interactif avec design Bootstrap amélioré.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Play, Pause, Flag, RotateCcw, Trophy } from 'lucide-react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const COLORS = ['#0d6efd', '#dc3545', '#198754'];
const INITIAL_SWIMMERS = [
  { id: 1, name: 'Nageur 1', laps: [], finishTime: null },
  { id: 2, name: 'Nageur 2', laps: [], finishTime: null },
  { id: 3, name: 'Nageur 3', laps: [], finishTime: null }
];

const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

const Chronometer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [swimmers, setSwimmers] = useState(INITIAL_SWIMMERS);
  const [raceFinished, setRaceFinished] = useState(false);

  const toggleTimer = useCallback(() => {
    if (raceFinished) return;
    if (!isRunning) {
      const id = setInterval(() => setTime(prev => prev + 10), 10);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    setIsRunning(!isRunning);
  }, [isRunning, intervalId, raceFinished]);

  const recordLap = (id) => {
    if (!isRunning || raceFinished) return;
    setSwimmers(prev => prev.map(swimmer => {
      if (swimmer.id === id) {
        const last = swimmer.laps.at(-1)?.time || 0;
        return {
          ...swimmer,
          laps: [...swimmer.laps, { number: swimmer.laps.length + 1, time, splitTime: time - last }]
        };
      }
      return swimmer;
    }));
  };

  const finishSwimmer = (id) => {
    if (!isRunning) return;
    const updated = swimmers.map(swimmer => 
      swimmer.id === id && swimmer.finishTime === null ? { ...swimmer, finishTime: time } : swimmer);
    setSwimmers(updated);
    if (updated.every(s => s.finishTime !== null)) {
      clearInterval(intervalId);
      setIsRunning(false);
      setRaceFinished(true);
    }
  };

  const reset = () => {
    clearInterval(intervalId);
    setTime(0);
    setSwimmers(INITIAL_SWIMMERS);
    setIsRunning(false);
    setIntervalId(null);
    setRaceFinished(false);
  };

  useEffect(() => () => clearInterval(intervalId), [intervalId]);

  const chartData = swimmers[0].laps.map((_, i) => {
    const d = { lap: i + 1 };
    swimmers.forEach(s => {
      if (s.laps[i]) d[`swimmer${s.id}`] = s.laps[i].splitTime / 1000;
    });
    return d;
  });

  const getRaceResults = () => {
    const sorted = swimmers.filter(s => s.finishTime !== null).sort((a, b) => a.finishTime - b.finishTime);
    const best = sorted[0]?.finishTime || 0;
    return sorted.map(s => ({ ...s, diff: s.finishTime - best === 0 ? '-' : `+${formatTime(s.finishTime - best)}` }));
  };

  const averageLap = (id) => {
    const s = swimmers.find(s => s.id === id);
    if (!s || s.laps.length === 0) return '00:00.00';
    const avg = s.laps.reduce((a, l) => a + l.splitTime, 0) / s.laps.length;
    return formatTime(avg);
  };

  return (
    <>
      <Header />
      <main className="container py-4">
        <div className="text-center mb-4">
          <h1 className="display-4 fw-bold text-primary">{formatTime(time)}</h1>
          <div className="d-flex justify-content-center gap-3 mb-3">
            <button onClick={toggleTimer} disabled={raceFinished} className="btn btn-outline-primary btn-lg">
              {isRunning ? <Pause size={18} /> : <Play size={18} />} {isRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={reset} className="btn btn-outline-danger btn-lg">
              <RotateCcw size={18} /> Reset
            </button>
          </div>
        </div>

        <div className="row g-3 mb-4">
          {swimmers.map((swimmer, idx) => (
            <div className="col-md-4" key={swimmer.id}>
              <div className="border rounded p-3 shadow-sm" style={{ borderColor: COLORS[idx] }}>
                <h5 className="fw-semibold text-center mb-2">{swimmer.name}</h5>
                <div className="d-flex justify-content-center gap-2">
                  <button onClick={() => recordLap(swimmer.id)} disabled={!isRunning || swimmer.finishTime} className="btn btn-success">
                    <Flag size={16} /> Lap
                  </button>
                  <button onClick={() => finishSwimmer(swimmer.id)} disabled={!isRunning || swimmer.finishTime} className="btn btn-warning">
                    <Trophy size={16} /> Finish
                  </button>
                </div>
                <p className="text-center small mt-2">Laps: {swimmer.laps.length} | Moyenne: {averageLap(swimmer.id)}</p>
              </div>
            </div>
          ))}
        </div>

        {(raceFinished || swimmers.some(s => s.finishTime)) && (
          <div className="mb-4">
            <h4 className="fw-bold mb-3"><Trophy className="text-warning me-2" size={20} /> Classement final</h4>
            <table className="table table-bordered">
              <thead className="table-light">
                <tr><th>#</th><th>Nageur</th><th>Temps final</th><th>Différence</th></tr>
              </thead>
              <tbody>
                {getRaceResults().map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>{s.name}</td>
                    <td>{formatTime(s.finishTime)}</td>
                    <td>{s.diff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {swimmers.map((swimmer, idx) => (
          <div key={swimmer.id} className="mb-4">
            <h5 className="text-decoration-underline" style={{ color: COLORS[idx] }}>{swimmer.name} - Détails des tours</h5>
            <table className="table table-sm table-striped">
              <thead>
                <tr><th>Tour</th><th>Intermédiaire</th><th>Total</th></tr>
              </thead>
              <tbody>
                {swimmer.laps.map((lap) => (
                  <tr key={lap.number}>
                    <td>{lap.number}</td>
                    <td>{formatTime(lap.splitTime)}</td>
                    <td>{formatTime(lap.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {chartData.length > 0 && (
          <div className="bg-light p-3 rounded shadow">
            <h5 className="mb-3">Évolution des temps par nageur</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="lap" />
                <YAxis />
                <Tooltip />
                <Legend />
                {swimmers.map((swimmer, index) => (
                  <Line
                    key={swimmer.id}
                    type="monotone"
                    dataKey={`swimmer${swimmer.id}`}
                    name={swimmer.name}
                    stroke={COLORS[index]}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Chronometer;
