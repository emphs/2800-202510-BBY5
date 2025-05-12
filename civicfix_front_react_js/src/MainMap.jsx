import React, {useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, useMapEvent} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

let mapCtx = undefined

function Phylocation() {
    const [position, setPosition] = useState(null)
    mapCtx = useMapEvents({
        locationfound(e) {
            setPosition(e.latlng)
            mapCtx.flyTo(e.latlng, mapCtx.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

export default function MobileMap() {
    const initPosition = [49.1871, -122.9241];

    const styles = {
        position: 'absolute',
        // width: '',
        height: '100vh',
    };

    // const [mapCtx, setmapCtx] = useState(null)
    const [phyPosition, setPhyPosition] = useState(null)
    // const map = useMapEvents({
    //     // click() {
    //     //     map.locate()
    //     // },
    //     locationfound(e) {
    //         setPhyPosition(e.latlng)
    //         map.flyTo(e.latlng, map.getZoom())
    //     },
    // })

    function onLoacte() {
        let r = mapCtx?.locate()
        console.log(r)
    }


    return (
        <div className="w-full" style={styles}>
            <MapContainer
                className="w-full"
                center={initPosition}
                zoom={13}
                scrollWheelZoom={false}
                style={styles}
                touchZoom={true}
                dragging={true}
            >
                <TileLayer
                    maxZoom={12}
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Phylocation/>

            </MapContainer>
            <button
                className="absolute right-3 top-3 bg-blue-500 text-white font-bold py-2 px-4 border-b-4 border-blue-700 rounded"
                onClick={() => onLoacte()}
                style={{zIndex: 400}}
            >
                locate
            </button>
        </div>
    );
};