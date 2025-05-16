import React from 'react';
import MapDisplay from './components/MapDisplay';
import LocateButton from './components/LocateButton';
import useGeolocation from './hooks/useGeolocation';

export default function MainMap() {
  const initPosition = [49.1871, -122.9241];
  const { position, locate } = useGeolocation();

  return (
    <div className="w-100 position-relative" style={{ height: '400px' }}>
      <MapDisplay
        center={position ? [position.lat, position.lng] : initPosition}
        markerPosition={position ? [position.lat, position.lng] : null}
      />
      <LocateButton onLocate={locate} />
    </div>
  );
}