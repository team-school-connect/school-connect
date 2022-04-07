/**
 * 
 * This component was created with the help of the following tutorial:
 * https://github.com/leighhalliday/google-maps-react-2020/blob/master/src/App.js
 */

import { useState, useRef, useCallback } from 'react'
import {
    GoogleMap,
    useLoadScript,
    Marker,
} from "@react-google-maps/api";

import {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { useAlert } from "react-alert";


const libraries = ["places"];
const torontoCenter = {
    lat: 43.6532,
    lng: -79.3832,
};
const mapContainerStyle = {
    height: "50vh",
    width: "70vw",
};

const Map = ({location}) => {
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : "",
        libraries,
    });
    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);
    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(16);
    }, []);

    const alert = useAlert();
    
    const panToAddressCoordinates = async (address) => {
        try {
            const results = await getGeocode({ 'address': location });
            const { lat, lng } = await getLatLng(results[0]);
            setLat(lat);
            setLng(lng);
            panTo({ lat, lng });
        } catch (err) {
            alert.error(err.toString());
        }
    };
    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

    panToAddressCoordinates(location);
    return (
        <GoogleMap
            id="map"
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={torontoCenter}
            onLoad={onMapLoad}
            >
            <Marker
                key={`${lat}-${lng}`}
                position={{ lat: lat, lng: lng }}
            />
        </GoogleMap>
    );

}

export default Map;