import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { loadGoogleMaps } from '../utils/googleMapsLoader';

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 }; // Riyadh

export default function AgentMap({ lat, lng }) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    loadGoogleMaps({
      apiKey: 'AIzaSyDG48YF2dsvPN0qHX3_vSaTJj6aqg3-Oc4',
    }).then(() => setIsLoaded(true));
  }, []);

  const center = lat && lng ? { lat, lng } : DEFAULT_CENTER;
  const zoom = lat && lng ? 14 : 6;

  return (
    <div style={{ width: '100%', height: 400, borderRadius: 12, overflow: 'hidden' }}>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={zoom}
        >
          {lat && lng && <Marker position={{ lat, lng }} />}
        </GoogleMap>
      )}
    </div>
  );
}
