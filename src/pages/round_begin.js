// Filename - pages/round_begin.js

import React, {useEffect, useState, useRef} from "react";
import { useLocation } from 'react-router-dom';
import Map from "../components/Map";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

const RoundBegin = () => {

    const location = useLocation();
    const moveable_location = location.state.moveable_location;
    const offset_sent = location.state.offset;
    const [locationState, setLocationState] = useState(location.state.location);
    const mapRef = useRef();
    // const [path, setPath] = useState([]); 
    // const [moveable_path, setMoveablePath] = useState([]);
    const history = useNavigate();
    const [marker_set, setMarkerSet] = useState(true);
    // const [paths, setPaths] = useState({ path: [], moveablePath: [] });

    // const [moveableLocation, setMoveableLocation] = useState(location.state.moveable_location);

    const goToHomePage = () => {
        history('/' );
    };

    const goToStartRoundPage = () => {
        console.log('Entering goToStartRoundPage');
        console.log(locationState);
        const simpleLocationState = {
            coords: {
                latitude: locationState.coords.latitude,
                longitude: locationState.coords.longitude,
                accuracy: locationState.coords.accuracy,
            },
            timestamp: locationState.timestamp,
        };

        console.log(simpleLocationState);
    
        history('/round_started',  { state: { simpleLocationState, moveable_location, offset_sent}});
    };

    // useEffect(() => {
    //     if (location.state && location.state.location) {
    //         console.log(location.state.location);
    //         setLocationState(location.state.location);
    //     }
    // }, [location]);

    

    useEffect(() => {

        let watchId = null;

        console.log('Entering useEffect');
        console.log('Marker set', marker_set);

        const trackCurrentPosition = () => {
            if (navigator.geolocation) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        console.log("Watched position", position.coords);
                        console.log('watchId', watchId);    
                        console.log('Marker set', marker_set);
                        // Update the moveable marker's position here
                        mapRef.current.getMoveableMarker().setLatLng([position.coords.latitude + offset_sent.latOffset, position.coords.longitude + offset_sent.lngOffset]);

                        console.log('Moveable location', mapRef.current.getMoveableMarker().getLatLng());
                        // setPath((prevPath) => [...prevPath, [position.coords.latitude, position.coords.longitude]]);
                        // setMoveablePath((prevPath) => [...prevPath, [mapRef.current.getMoveableMarker().getLatLng().lat, mapRef.current.getMoveableMarker().getLatLng().lng]]);
                        // setPaths(prevPaths => {
                        //     const newPath = [...prevPaths.path, [position.coords.latitude, position.coords.longitude]];
                        //     const newMoveablePath = [...prevPaths.moveablePath, [mapRef.current.getMoveableMarker().getLatLng().lat, mapRef.current.getMoveableMarker().getLatLng().lng]];
                        //     return { path: newPath, moveablePath: newMoveablePath };
                        // });
                        // setPaths(prevPaths => {
                        //     const newLocation = [position.coords.latitude, position.coords.longitude];
                        //     const newMoveableLocation = [mapRef.current.getMoveableMarker().getLatLng().lat, mapRef.current.getMoveableMarker().getLatLng().lng];
                        
                        //     let newPath = [...prevPaths.path];
                        //     let newMoveablePath = [...prevPaths.moveablePath];
                        
                        //     if (newPath.length === 0 || (newPath[newPath.length - 1][0] !== newLocation[0] || newPath[newPath.length - 1][1] !== newLocation[1])) {
                        //         newPath.push(newLocation);
                        //     }
                        
                        //     if (newMoveablePath.length === 0 || (newMoveablePath[newMoveablePath.length - 1][0] !== newMoveableLocation[0] || newMoveablePath[newMoveablePath.length - 1][1] !== newMoveableLocation[1])) {
                        //         newMoveablePath.push(newMoveableLocation);
                        //     }
                        
                        //     return { path: newPath, moveablePath: newMoveablePath };
                        // });
                        setLocationState(position);
                    },
                    (error) => {
                        console.error(error);
                    }
                );  
            } else {
                console.log('Geolocation is not supported by this browser.');
            }
        };

        if(marker_set) {
            console.log('Entering')
            trackCurrentPosition();
        }

        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [marker_set, offset_sent.latOffset, offset_sent.lngOffset ]);

    // const drawPath = (path_selected) => {
    //     console.log(mapRef)
    //     console.log('Drawing path', path_selected);

    //     if (mapRef.current) {

    //         const map = mapRef.current.getMap();

    //         console.log('Drawing path', path_selected);

    //         if (path_selected.length === 0) {
    //             console.log('No path to draw');
    //             return;
    //         }
        
    //         const polyline = L.polyline(path_selected, {color: 'red'}).addTo(map);
    //         map.fitBounds(polyline.getBounds());
            
    //         console.log('Path drawn');
    //     }
    //     else {
    //         console.log('Map not initialized');
    //     }

    // };

    const resetMap = () => {
        console.log('Resetting map');
        const map = mapRef.current.getMap();
        const moveable_marker = mapRef.current.getMoveableMarker();
        const fixed_marker = mapRef.current.getFixedMarker();
        if (map){
            map.setView([0, 0], 13);
            moveable_marker.setLatLng([0, 0]);
            fixed_marker.setLatLng([0, 0]);
            setMarkerSet(false);
            console.log('Marker set', marker_set)

            //clear polyline
            map.eachLayer(function (layer) {
                if (layer instanceof L.Polyline) {
                    layer.remove();
                }
            });
            // setPath([]);
            // setMoveablePath([]);
            console.log('Map reset');
            goToHomePage();
        }
        else {
            console.log('Map not initialized');
        }
    }

	return (
		<div>
			<h1>
                Golf Strava Begin Round Page
			</h1>
            {/* <p>Location: {locationState.coords.latitude} {locationState.coords.longitude}</p> */}
            {/* <Map ref={mapRef} locationState={locationState} moveable_location={moveable_location} small /> */}
            <Map ref={mapRef} locationState={locationState} moveable_location={moveable_location} small offset={offset_sent} />
            <button onClick={resetMap}>Reset Map</button>
            <button onClick={goToStartRoundPage}>Start Round</button> 
            {/* <button onClick={() => console.log(locationState, path, moveable_location)}>Log Location</button> */}
            {/* <button onClick={() => drawPath(paths.path)}>Draw Path</button> 
            <button onClick={() => drawPath(paths.moveablePath)}>Draw Moveable Path</button> */}
            {/* <p>Log Location: {path}</p>
            <p>Log Moveable Location: {moveable_path}</p> */}
            {/* <p>Log Location spaces: {path.map(coords => coords.join(', ')).join(' | ')}</p>
            <p>Log Moveable Location spaces: {moveable_path.map(coords => coords.join(', ')).join(' | ')}</p>
            <p>Path: {paths.path.map(coords => coords.join(', ')).join(' | ')}</p>
            <p>Moveable Path: {paths.moveablePath.map(coords => coords.join(', ')).join(' | ')}</p>
            <p>Path length: {paths.path.length} Moveable Path Length: {paths.moveablePath.length}</p>
            <p>Location State: {moveable_location.coords.latitude} {moveable_location.coords.longitude}</p>
            <button onClick={goToHomePage}>Go to Home Page</button> */}
            {/* <p>Moveable Location: {moveable_location.coords.latitude} {moveable_location.coords.longitude}</p>
            <p>Offset sent: {offset_sent.latOffset}, {offset_sent.lngOffset}</p> */}
		</div>
	);
};

export default RoundBegin;
