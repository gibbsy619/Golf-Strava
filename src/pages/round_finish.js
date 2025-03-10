// Filename - pages/round_finish.js

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Map from "../components/Map";
import { useLocation } from 'react-router-dom';

const RoundFinish = () => {
	const history = useNavigate();
	const mapRef = useRef();
	const location = useLocation();
    const moveable_location = location.state.moveable_location;
    const offset_sent = location.state.offset_sent;
	const locationState = location.state.simpleLocationState;
	const paths = location.state.paths
	const [golfData, setGolfData] = useState(null);

	const goToHomePage = () => {
		history('/');
	};

	useEffect(() => {
		fetch('/api/data')
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => setGolfData(data))
			.catch(error => console.error('Error:', error));
	}, []);
	
	// const showInformation = () => {
	// 	if (golfData) {
	// 		console.log(golfData);
	// 	} else {
	// 		console.log('No data fetched yet');
	// 	}
	// };


	return ( 
		<div>
			<h1>Golf Strava Round Finished Page</h1>
			

			<div id='mapparent'>
				


				<Map ref={mapRef} locationState={locationState} moveable_location={moveable_location} offset={offset_sent} finish paths={paths} map_background /> 
				{/* <div className="contentOverMap">
					<button onClick={goToHomePage}>Go To Home Page</button>
					{/* <p>Location: {locationState.coords.latitude} {locationState.coords.longitude}</p>
					<p>Moveable Location: {moveable_location.coords.latitude} {moveable_location.coords.longitude}</p>
					<p>Offset: {offset_sent.latOffset}, {offset_sent.lngOffset}</p>
					<p>Path: {paths.path.map(coords => coords.location.join(', ')).join(' | ')}</p>
					<p>Moveable Path: {paths.moveablePath.map(coords => coords.location.join(', ')).join(' | ')}</p> */}
					
					{/* <button onClick={showInformation}>Get Information</button> */}
				{/* </div> */}

				{/* {golfData && (
					<table>
						<thead>
							<tr>
								<th>Hole</th>
								<th>Score</th>
							</tr>
						</thead>
						<tbody>
							{Object.entries(golfData).map(([player, data], index) => (
								<tr key={index}>
									<td>{data.currentHole}</td>
									<td>{data.counter}</td>
								</tr>
							))}	
						</tbody>
					</table>
					
				)}
				
				<p>Total Counter: {
					golfData && Object.values(golfData).reduce((total, data) => total + data.counter, 0)
				}</p> */}

			</div>
			<div style={{display: 'flex', justifyContent: 'center'}}>
				{golfData && (
					<table>
						<thead>
							<tr>
								<th className="table-cell">Hole</th>
								{Object.values(golfData).map((data, index) => (
									<th key={index}>{data.currentHole}</th>
								))}
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="table-cell">Score</td>
								{Object.values(golfData).map((data, index) => (
									<td key={index}>{data.counter}</td>
								))}
							</tr>
						</tbody>
					</table>
				)}
			</div>
				
			<p>Total Counter: {
				golfData && Object.values(golfData).reduce((total, data) => total + data.counter, 0)
			}</p>
			<button onClick={goToHomePage}>Go To Home Page</button>
					{/* <p>Location: {locationState.coords.latitude} {locationState.coords.longitude}</p>
					<p>Moveable Location: {moveable_location.coords.latitude} {moveable_location.coords.longitude}</p>
					<p>Offset: {offset_sent.latOffset}, {offset_sent.lngOffset}</p>
					<p>Path: {paths.path.map(coords => coords.location.join(', ')).join(' | ')}</p>
					<p>Moveable Path: {paths.moveablePath.map(coords => coords.location.join(', ')).join(' | ')}</p> */}
					
			{/* <button onClick={showInformation}>Get Information</button> */}
		</div>
	);
};

export default RoundFinish;
