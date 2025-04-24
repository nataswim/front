/**
 * 🇬🇧 InteractiveMap component with geolocation, search and directions
 * 🇫🇷 Composant InteractiveMap avec géolocalisation, recherche et itinéraire (version Bootstrap/CSS améliorée)
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Search, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

function RecenterMap({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, zoom || map.getZoom());
  }, [position, map, zoom]);
  return null;
}

export default function InteractiveMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState('');
  const [mapType, setMapType] = useState('streets');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [locationName, setLocationName] = useState('');

  const customIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
        setError('');
      },
      (err) => setError(`Erreur de géolocalisation: ${err.message}`)
    );
  };

  const searchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError('');
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setSelectedLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setLocationName(display_name);
      } else setError('Aucun résultat trouvé');
    } catch {
      setError('Erreur de recherche');
    } finally {
      setIsSearching(false);
    }
  };

  const getDirectionsUrl = () => {
    if (!userLocation || !selectedLocation) return '';
    return `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${selectedLocation.lat},${selectedLocation.lng}`;
  };

  return (
    <>
      <Header />
      <main className="container-fluid p-0">
        <div className="bg-white border-bottom py-3 px-4 shadow-sm">
          <form onSubmit={searchLocation} className="mb-3">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Rechercher un lieu..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button className="btn btn-outline-secondary" type="submit" disabled={isSearching}>
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <button className="btn btn-primary" onClick={getUserLocation}>Ma Position</button>
            <select className="form-select w-auto" value={mapType} onChange={(e) => setMapType(e.target.value)}>
              <option value="streets">Plan</option>
              <option value="satellite">Satellite</option>
            </select>
            {userLocation && selectedLocation && (
              <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-success d-flex align-items-center gap-2">
                <Navigation size={16} /> Itinéraire Google Maps
              </a>
            )}
            {error && <div className="text-danger mt-2">{error}</div>}
          </div>
        </div>

        <div style={{ height: '80vh', width: '100%' }}>
          <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url={mapType === 'streets'
                ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'}
            />

            {userLocation && (
              <Marker position={userLocation} icon={customIcon}>
                <Popup>Votre position</Popup>
              </Marker>
            )}

            {selectedLocation && (
              <Marker position={selectedLocation} icon={customIcon}>
                <Popup>{locationName || 'Destination'}</Popup>
              </Marker>
            )}

            <RecenterMap position={selectedLocation || userLocation} zoom={selectedLocation ? 15 : 13} />
          </MapContainer>
        </div>
      </main>
      <Footer />
    </>
  );
}
