// class MapComponent extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             path: [],
//             recording: false,
//             watchId: null,
//             moveable_marker_set: false,
//             latitude: 0,
//             longitude: 0,
//             geo_location: 0,
//             global_moveable_marker_latlang: 0,
//         };

//         this.handleLocationError = this.handleLocationError.bind(this);
//     }

//     componentDidMount() {
//         console.log('Component mounted to DOM');

//         if (!this.map) {
//             console.log('Initializing map');
//             this.map =  L.map('map').setView([0, 0], 13)
//             L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

//             const redIcon = L.icon({
//                 iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//                 shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//                 iconSize: [25, 41],
//                 iconAnchor: [12, 41],
//                 popupAnchor: [1, -34],
//                 shadowSize: [41, 41]
//             });

//             const blueIcon = L.icon({
//                 iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
//                 shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//                 iconSize: [25, 41],
//                 iconAnchor: [12, 41],
//                 popupAnchor: [1, -34],
//                 shadowSize: [41, 41]
//             });



//             this.fixed_marker = L.marker([0, 0], {icon: blueIcon});
//             this.map.addLayer(this.fixed_marker);
    
//             this.moveable_marker = L.marker([0, 0], {icon: redIcon, draggable: true});
//             this.map.addLayer(this.moveable_marker);

//         }
//         else {
//             console.log('Map already initialized');
//         }
//     }

//     // Function to get the current path
//     getPath() {
//         return this.state.path;
//     }

//     // Function to handle geolocation error
//     handleLocationError(error) {
//         this.setState({geo_location: error.message});
//         console.error('Error getting location:', error.message);
//         // this.setState({geo_location: 10});
//     }

//     // Function to log location
//     logLocation() {
//         if (this.state.path.length > 0) {
//             const lastLocation = this.state.path[this.state.path.length - 1];
//             console.log('Path:', this.getPath());
//             console.log('GPS Location:', lastLocation, "path", this.getPath());
//         }
//     }

//     updateLocation = (position) => {
//         const new_latlng = [position.coords.latitude, position.coords.longitude, new Date()];
//         const lastLocation = this.state.path[this.state.path.length - 1];

//         // Check if position has changed significantly
//         if (lastLocation && lastLocation[0] === new_latlng[0] && lastLocation[1] === new_latlng[1]) {
//             return; // Position hasn't changed, so don't update
//         }
    

//         this.setState({geo_location: 9});
//         console.log('Updating location');
//         const latlng = L.latLng(position.coords.latitude, position.coords.longitude);
//         this.fixed_marker.setLatLng(latlng);
//         if (!this.state.moveable_marker_set) {
//             console.log('Setting moveable marker');
//             const moveable_marker_latlng = L.latLng(position.coords.latitude-0.001, position.coords.longitude+0.001);
//             this.moveable_marker.setLatLng(moveable_marker_latlng);
//             this.setState({moveable_marker_set: true, global_moveable_marker_latlang: [moveable_marker_latlng.lat, moveable_marker_latlng.lng]});
//         }
//         this.map.setView(latlng);
//         this.global_latlang = new_latlng;
//         console.log('latlng', new_latlng);
//         if (this.state.recording) {
//             const newPath = [...this.state.path, new_latlng];
//             this.setState({ path: newPath });
//             this.props.updatePath(newPath);  
//         }

//         this.logLocation();

//         this.setState({
//             latitude: new_latlng[0],
//             longitude: new_latlng[1],
//         });

//     }

//     // Function to get current location
//     getCurrentLocation = () => {
//         console.log('Getting current location');
//         this.setState({geo_location: 2});
//         if (navigator.geolocation) {
//             this.setState({geo_location: 8});
//             return navigator.geolocation.watchPosition((position) => {
//                 this.setState({geo_location: 4});
//                 this.updateLocation(position);
//             }, this.handleLocationError);
//         } else {
//             console.error('Geolocation is not supported by this browser.');
//             this.setState({geo_location: 3});
//         }
//     }
    
//     // Start recording button click handler
//     startRecording = () => {
//         console.log("Start Recording");
//         this.setState({geo_location: 1});
//         if (!this.state.recording) {
//             console.log('Path:', this.getPath());
//             this.setState({moveable_marker_set: false, recording: true, path: [] }); // Clear previous path
//             console.log('Path:', this.getPath());
//             if (!this.state.watchId) {
//                 const watchId = this.getCurrentLocation(); // Start getting current location and store the watch ID
//                 this.setState({watchId});
//             }
//             console.log('Recording started');
//         }
    
//         else {
//             console.log('Already recording');
//             this.setState({geo_location: 6});
//         }
//     }

//     // Stop recording button click handler
//     stopRecording = () => {
//         console.log("Stop Recording");
//         if (this.state.recording) {
//             this.setState({recording: false})
//             console.log('watch id', this.state.watchId)
//             if (this.state.watchId) {
//                 navigator.geolocation.clearWatch(this.state.watchId); // Stop getting current location
//                 this.setState({watchId: null});
//             }
//             console.log('Recording stopped');
//         }
//         else {
//             console.log('Not recording');
//             this.setState({geo_location: 7});
//         }
//     }

//     // Draw path button click handler
//     drawPath = () => {
//         console.log('Drawing path');
//         console.log('Path:', this.getPath());
//         if (this.getPath().length === 0) {
//             console.log('No path to draw');
//             return;
//         }
//         const polyline = L.polyline(this.getPath(), {color: 'red'}).addTo(this.map);
//         this.map.fitBounds(polyline.getBounds());

//         console.log('Path drawn');
//     }

//     // Confirm location button click handler
//     confirmLocation = () => {
//         console.log('Confirming location');
//         if (this.state.moveable_marker_set) {
//             const new_moveable_latlng = this.moveable_marker.getLatLng();
//             this.setState({global_moveable_marker_latlang: [new_moveable_latlng.lat, new_moveable_latlng.lng]});
//             console.log('Confirmed location:', new_moveable_latlng);
//             console.log('Global confirmed location:', this.state.global_moveable_marker_latlang);
//             console.log('Location confirmed');
//         }
//         else {
//             console.log('No location to confirm');
//         }
//     }

//     // Reset map button click handler
//     resetMap = () => {
//         console.log('Resetting map');
//         if (this.map){
//             this.map.setView([0, 0], 13);
//             this.moveable_marker.setLatLng([0, 0]);
//             this.fixed_marker.setLatLng([0, 0]);
//             //clear polyline
//             this.map.eachLayer(function (layer) {
//                 if (layer instanceof L.Polyline) {
//                     layer.remove();
//                 }
//             });

//             if (this.state.watchId) {
//                 navigator.geolocation.clearWatch(this.state.watchId); // Stop getting current location
//                 this.setState({watchId: null});
//             }
//             this.setState({ path: [], recording: false, watchId: null, moveable_marker_set: false, latitude: 0, longitude: 0, geo_location: 0, global_moveable_marker_latlang: 0});
//             console.log('Map reset');

//         }
//         else {
//             console.log('Map not initialized');
//         }
//     }

//     render() {
//         return (
//             <div>
//                 <div id="mapparent">
//                     <div id="map"></div>
//                 </div>
//                 <div className="buttons">
//                     <button onClick={this.startRecording}>Start Recording</button>
//                     <button onClick={this.stopRecording}>Stop Recording</button>
//                 </div>
//                 <div className="coordinates">
//                     <p>Latitude: <span id="latitude">{this.state.latitude}</span></p>
//                     <p>Longitude: <span id="longitude">{this.state.longitude}</span></p>
//                     <p>Geo location: <span id="geo_location">{this.state.geo_location}</span></p>
//                     <p>Moveable Marker Location: <span id="moveable_marker_latlang">{this.state.global_moveable_marker_latlang}</span></p>
//                 </div>
//                 <div className="buttons">
//                     <button onClick={this.drawPath}>Draw Path</button>
//                     <button onClick={this.confirmLocation}>Confirm Location</button>
//                     <button onClick={this.resetMap}>Reset</button>
//                 </div>

//             </div>
//         );
//     }
// }

// export default MapComponent;