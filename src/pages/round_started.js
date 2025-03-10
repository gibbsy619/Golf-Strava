// Filename - pages/round_started.js

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Map from "../components/Map";
import { useLocation } from 'react-router-dom';
// import L from 'leaflet';

const RoundStarted = () => {

	const [counter, setCounter] = useState(1);
	const history = useNavigate();
	const mapRef = useRef();
	const location = useLocation();
    const [moveable_location, setMoveableState] = useState(location.state.moveable_location);
    const offset_sent = location.state.offset_sent;
	// const locationState = location.state.simpleLocationState;
	const [locationState, setLocationState] = useState(location.state.simpleLocationState);
	const marker_set = true;
    const [paths, setPaths] = useState({ path: [], moveablePath: [] });
    const [recentPaths, setRecentPaths] = useState([]);
    const [currentHole, setCurrentHole] = useState(1);
    const [saveInformation, setSaveInformation] = useState([]);

	const goToHomePage = () => {
		history('/');
	};

    const goToFinishPage = () => {
        console.log('Entering goToRoundFinishPage');
        console.log(locationState);
        const simpleLocationState = {
            coords: {
                latitude: locationState.coords.latitude,
                longitude: locationState.coords.longitude,
                accuracy: locationState.coords.accuracy,
            },
            timestamp: locationState.timestamp,
        };

        console.log('Simple:',simpleLocationState);

        fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ saveInformation }), // Send the accumulated save information
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setSaveInformation([]); // Step 4: Reset save information state
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    
        history('/round_finish',  { state: { simpleLocationState, moveable_location, offset_sent, paths}});
    }

	useEffect(() => {

        let watchId = null;

        console.log('Entering useEffect')
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
                        setPaths(prevPaths => {
                            const newLocation = [position.coords.latitude, position.coords.longitude];
                            const newMoveableLocation = [mapRef.current.getMoveableMarker().getLatLng().lat, mapRef.current.getMoveableMarker().getLatLng().lng];
                            const timestamp = new Date().toISOString();
                        
                            let newPath = [...prevPaths.path];
                            let newMoveablePath = [...prevPaths.moveablePath];

                            console.log('newPath', newPath);
                            console.log('newMoveablePath', newMoveablePath);
                        
                            if (newPath.length === 0 || (newPath[newPath.length - 1][0] !== newLocation[0] || newPath[newPath.length - 1][1] !== newLocation[1])) {
                                newPath.push({ location: newLocation, timestamp });
                                // newPath.push(newLocation);
                            }
                        
                            if (newMoveablePath.length === 0 || (newMoveablePath[newMoveablePath.length - 1][0] !== newMoveableLocation[0] || newMoveablePath[newMoveablePath.length - 1][1] !== newMoveableLocation[1])) {
                                newMoveablePath.push({ location: newMoveableLocation, timestamp });
                                // newMoveablePath.push(newMoveableLocation);

                            }
                            setMoveableState({coords : { latitude: newMoveableLocation[0], longitude: newMoveableLocation[1] }});
                        
                            return { path: newPath, moveablePath: newMoveablePath };
                        });
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
    }, [marker_set, offset_sent.latOffset, offset_sent.lngOffset]);

    const increaseCounter = () => {
        if (counter < 10) {
            setCounter(counter + 1);
        }
        console.log("Counter increased", counter);
    };

    const decreaseCounter = () => {
		if (counter > 1) {
			setCounter(counter - 1);
		}
        console.log("Counter decreased", counter);
		console.log(locationState);
    };

	const resetCounter = () => {
		setCounter(1);
		console.log("Counter reset", counter);
	}

    const handleNextHole = () => {
        if (currentHole < 18) {
            setCurrentHole(currentHole + 1);
        }
    };
    
    const handlePreviousHole = () => {
        if (currentHole > 1) {
            setCurrentHole(currentHole - 1);
        }
    };

    const saveInfo = () => {
        console.log('Counter: ', counter);
        console.log('Current Hole: ', currentHole);
        console.log('Recent Paths: ', recentPaths);

        // Calculate the difference between recentPaths and paths.moveablePath
        const difference = paths.moveablePath.filter(path => !recentPaths.includes(path));
        console.log('Difference: ', difference);

        const dataToSave = {
            counter,
            currentHole,
            recentPaths,
            difference
        };

        // Find index of the existing entry for the current hole, if it exists
        const existingEntryIndex = saveInformation.findIndex(info => info.currentHole === currentHole);

        if (existingEntryIndex !== -1) {
            // If entry exists, update it
            const updatedSaveInformation = [...saveInformation];
            updatedSaveInformation[existingEntryIndex] = dataToSave;
            setSaveInformation(updatedSaveInformation);
        } else {
            // If entry does not exist, add a new one
            setSaveInformation(prevInfo => [...prevInfo, dataToSave]);
        }

        // check length of array
        if (saveInformation.length > 18) {
            console.log('All holes have been played');
        } else {
            console.log('Not all holes have been played');
        }

        console.log('Save Information: ', saveInformation);
    
        // fetch('/api/save', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(dataToSave),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Success:', data);
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        // });

        setCounter(1);
        handleNextHole();
        setRecentPaths(paths.moveablePath);
    }

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
    //         // Map path_selected to an array of locations
    //         const locations = path_selected.map(coords => coords.location);

    //         console.log(locations);
        
    //         const polyline = L.polyline(locations, {color: 'red'}).addTo(map);
    //         map.fitBounds(polyline.getBounds());
            
    //         console.log('Path drawn');
    //     }
    //     else {
    //         console.log('Map not initialized');
    //     }

    // };

	return (
		<div>
			<h1>
                Golf Strava Round Started Page
			</h1>
			<Map ref={mapRef} locationState={locationState} moveable_location={moveable_location} small offset={offset_sent} />
			<p>Score: {counter}</p>
			<button onClick={increaseCounter}>Increase Score</button>
			<button onClick={decreaseCounter}>Decrease Score</button>
			<button onClick={resetCounter}>Reset Score</button>
			{/* <p>Location: {locationState.coords.latitude} {locationState.coords.longitude}</p>
			<p>Moveable Location: {moveable_location.coords.latitude} {moveable_location.coords.longitude}</p>
			<p>Offset: {offset_sent.latOffset}, {offset_sent.lngOffset}</p> */}
			<div>
                <button onClick={handlePreviousHole}>Previous Hole</button>
                <div>Hole {currentHole}</div>
                <button onClick={handleNextHole}>Next Hole</button>
                <button onClick={saveInfo}>Save Information</button>
            </div>
            {/* <p>Path: {paths.path.map(coords => coords.location.join(', ')).join(' | ')}</p>
            <p>Moveable Path: {paths.moveablePath.map(coords => coords.location.join(', ')).join(' | ')}</p>
            <p>Recent Paths: {recentPaths.map(coords => coords.location.join(', ')).join(' | ')}</p>
            <p>Path length: {paths.path.length} Moveable Path Length: {paths.moveablePath.length}</p> */}
            {/* <button onClick={() => drawPath(paths.path)}>Draw Path</button> 
            <button onClick={() => drawPath(paths.moveablePath)}>Draw Moveable Path</button>
            <p>Location State: {moveable_location.coords.latitude} {moveable_location.coords.longitude}</p> */}
            <button onClick={goToHomePage}>Go to Home Page</button>
            <button onClick={goToFinishPage}>Go to Round Finish Page</button>
            {/* <p>Moveable Location: {moveable_location.coords.latitude} {moveable_location.coords.longitude}</p>
            <p>Offset sent: {offset_sent.latOffset}, {offset_sent.lngOffset}</p> */}
		</div>
	);
};

export default RoundStarted;
