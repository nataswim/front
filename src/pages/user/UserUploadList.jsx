import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChartLine, 
  FaSwimmer, 
  FaCalendarCheck, 
  FaListAlt, 
  FaUserEdit,
  FaRunning,
  FaUpload,
  FaClipboardList,
  FaTrophy,
  FaStopwatch,
  FaRulerHorizontal,
  FaCalendarAlt
} from 'react-icons/fa';
import Footer from '../../components/template/Footer';

const UserUploadList = () => {
  return (
    <div>
      <h1>Mes Médias</h1>
      <p>Gérez vos fichiers et vidéos d'entraînement ici.</p>
    </div>
  );
};

export default UserUploadList;