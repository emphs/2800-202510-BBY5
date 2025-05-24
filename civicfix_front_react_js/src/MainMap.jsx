import React from "react";
import MapDisplay from "./components/MapDisplay";
import LocateButton from "./components/LocateButton";
import useGeolocation from "./hooks/useGeolocation";

/**
 * The main map component of the app. It renders a map with the current user's
 * location as a marker, if the user has granted location access. Otherwise, it
 * renders a map with a marker at the given initial position.
 *
 * @returns {JSX.Element} A JSX element representing the main map component.
 */
export default function MainMap() {
  const initPosition = [49.1871, -122.9241];
  const { position, locate } = useGeolocation();

  return (
    <div className="w-100 position-relative" style={{ height: "400px" }}>
      <MapDisplay
        center={position ? [position.lat, position.lng] : initPosition}
        markerPosition={position ? [position.lat, position.lng] : null}
      />
      <LocateButton onLocate={locate} />
    </div>
  );
}
