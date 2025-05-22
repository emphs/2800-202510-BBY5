import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapDisplay = ({ center, markerPosition }) => (
  <MapContainer
    center={center}
    zoom={13}
    scrollWheelZoom={false}
    style={{ width: '100%', height: '400px' }}
    className="w-100 h-100"
  >
    <TileLayer
      maxZoom={12}
      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {markerPosition && (
      <Marker position={markerPosition}>
        <Popup>You are here</Popup>
      </Marker>
    )}
  </MapContainer>
);

export default MapDisplay;