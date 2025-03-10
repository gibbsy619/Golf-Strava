
// Filename - pages/index.js
 
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Map from "../components/Map";

const Home = () => {
    const [location, setLocation] = useState({coords : { latitude: 0, longitude: 0 }});
    const [moveable_location, setMoveableLocation] = useState({coords : { latitude: 0, longitude: 0 }});
    const mapRef = useRef();
    const history = useNavigate();
    const [isConfirmButtonClicked, setIsConfirmButtonClicked] = useState(false);
    const [isMoveableButtonClicked, setIsMoveableButtonClicked] = useState(false);
    const [offset, setOffset] = useState({ latOffset: 0, lngOffset: 0 });
    const [navigateToRoundBegin, setNavigateToRoundBegin] = useState(false);
    const [geolocationAllowed, setGeoLocationAllowed] = useState('');

    const goToRoundBeginPage = () => {
        console.log('going to round begin page')
        mapRef.current.setMoveableMarkerSet(() => {
            console.log('setMoveableMarkerSet completed');
            setNavigateToRoundBegin(true);
        });
        // history('/round_begin', { state: { location, moveable_location, offset} });
    };

    useEffect(() => {
        if (navigateToRoundBegin) {
            console.log('Inside useEffect')
            history('/round_begin', { state: { location, moveable_location, offset} });
            setNavigateToRoundBegin(false); // Reset for future navigations
        }
    }, [navigateToRoundBegin, offset, location, moveable_location, history]);

    const handleButtonClick = () => {
        if (!isConfirmButtonClicked) {

            getCurrentLocation();

            setIsConfirmButtonClicked(true);


        } else {
            // The button has been clicked, so do something else
            if (!isMoveableButtonClicked) {
                getMoveableMarkerLocation();
            } else{
                // setIsConfirmButtonClicked(true);

                if (geolocationAllowed === 'yes') {            
                    console.log('Button was clicked!');
                    console.log('going')
                    goToRoundBeginPage();
                    console.log('Going to round begin page');
                };
            }
        }
    };

    const updateLocation = (position) => {
        console.log(position)
        console.log(position.coords)
        if (position && position.coords) {
            const { latitude, longitude } = position.coords;
            console.log(latitude, longitude)
            setLocation({coords : { latitude: latitude, longitude: longitude }});
        }
    }

    const handleLocationError = (error) => {
        setGeoLocationAllowed(error);
        console.log(
            error
                ? 'Error: The Geolocation service failed.'
                : 'Error: Your browser doesn\'t support geolocation.'
        );
    }

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setGeoLocationAllowed('maybe');
            navigator.geolocation.getCurrentPosition((position) => {
                setGeoLocationAllowed('yes');
                console.log('Position', position);
                updateLocation(position);
            }, (error) => {
                console.error('Geolocation error:', error);
                setGeoLocationAllowed(error.message);
                // handleLocationError(false);
            });
        } else {
            // Browser doesn't support Geolocation
            setGeoLocationAllowed('No'); 
            handleLocationError(false);
        }
    }

    useEffect(() => {
        console.log("Location checking", location);
    }, [location]);

    const getMoveableMarkerLocation = () => {
        const temp_moveable_location = mapRef.current.getMoveableMarker();
        setMoveableLocation({coords : { latitude: temp_moveable_location._latlng.lat, longitude: temp_moveable_location._latlng.lng }});
        console.log('Moveable marker location new:', moveable_location);

    };

    const handleOffsetChange = (newOffset) => {
        setOffset(newOffset);

    };

    return (
        <div>
            <h1>Golf Strava Start/Confirm Page</h1>

            <Map onOffsetChange={handleOffsetChange} ref={mapRef} updateLocation={location} locationState={location} moveable_location={moveable_location} offset={offset} />
            {/* <button onClick={() => updateLocation({ coords: { latitude: 50, longitude: 50 } })}>Start Recording</button> */}
            
            {/* <button onClick={goToRoundBeginPage}>Go to round begin page</button> */}

            <button onClick={handleButtonClick}>
                {isConfirmButtonClicked ? 'Confirm Location' : 'Start Recording'}
            </button>
            <button onClick={() => {getMoveableMarkerLocation(); setIsMoveableButtonClicked(true);}}>Get moveable marker location</button>
            {/* <p>Location: {location.coords.latitude} {location.coords.longitude}</p>
            <p>Moveable Location: {moveable_location.coords.latitude} {moveable_location.coords.longitude}</p>
            <p>Offset: {offset.latOffset}, {offset.lngOffset}</p>
            <p>Geolocation Allowed: {geolocationAllowed}</p> */}
        </div>
    );
};

export default Home;