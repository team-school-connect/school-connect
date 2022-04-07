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
    InfoWindow,
  } from "@react-google-maps/api";

  import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";


const libraries = ["places"];
const Map = (props) => {
    const {location} = props;
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
    const panToAddressCoordinates = async (address) => {
        try {
            const results = await getGeocode({ 'address': location });
            const { lat, lng } = await getLatLng(results[0]);
            setLat(lat);
            setLng(lng);
            panTo({ lat, lng });
        } catch (error) {
            console.log("Problem: ", error);
        }
    };
    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";



    panToAddressCoordinates(location);
    const torontoCenter = {
        lat: 43.6532,
        lng: -79.3832,
    };
    const mapContainerStyle = {
        height: "50vh",
        width: "70vw",
        // center the map

      };
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