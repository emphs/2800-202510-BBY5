import { useState } from 'react';

const useGeolocation = () => {
  const [position, setPosition] = useState(null);

  const locate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        alert('Unable to retrieve your location');
      }
    );
  };

  return { position, locate };
};

export default useGeolocation;