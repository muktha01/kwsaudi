import React, { useRef, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const riyadh = { lat: 24.7136, lng: 46.6753 };
const jeddah = { lat: 21.4858, lng: 39.1925 };

const MarketCenterMap = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDhQDfHVkov3_YZ_Zt-m9N7Q-ytIxcVpx0',
  });
  const mapRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(riyadh);
    bounds.extend(jeddah);
    map.fitBounds(bounds, 80); // 80px padding
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={onLoad}
          // center and zoom will be set by fitBounds
        >
          <Marker position={riyadh}  />
          <Marker position={jeddah}  />
        </GoogleMap>
      )}
    </div>
  );
};

export default MarketCenterMap;
