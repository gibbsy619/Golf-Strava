import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class Map extends Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.fixed_marker = null;
        this.moveable_marker = null;
        this.state = {
            latOffset : 0,
            lngOffset : 0,
        }
        this.setMoveableMarkerSet = this.setMoveableMarkerSet.bind(this);
    }

    componentDidUpdate(prevProps) {
    // If the updateLocation prop has changed, call updateLocation
    if (this.props.updateLocation !== prevProps.updateLocation) {
        this.updateLocation(this.props.updateLocation);
        console.log('Updating location');
    }

    console.log('The component has updated')
    console.log('Props:', this.props.locationState, prevProps.locationState)
    console.log('UpdateLocation prop', this.props.updateLocation)
    if (this.props.locationState !== prevProps.locationState) {
        const latlng = L.latLng(this.props.locationState.coords.latitude, this.props.locationState.coords.longitude);
        this.fixed_marker.setLatLng(latlng);

        if (!this.moveable_marker_set) {
            this.moveable_marker.remove();

            // Change the draggable option
            this.moveable_marker.options.draggable = false;
            console.log(this.moveable_marker.options.draggable);

            // Add the marker back to the map
            this.moveable_marker.addTo(this.map);

            this.moveable_marker_set = true;
        }

        // // Calculate the new position for the moveable_marker
        // const moveableMarkerLatlng = L.latLng(latlng.lat + this.props.offset.latOffset, latlng.lng + this.props.offset.lngOffset);

        // this.moveable_marker.setLatLng(moveableMarkerLatlng);

        console.log('moveable marker:', this.moveable_marker._latlng.lat, this.moveable_marker._latlng.lng)

        // console.log(latlng, moveableMarkerLatlng, this.state.latOffset, this.state.lngOffset, this.props.offset)
        console.log(latlng, this.state.latOffset, this.state.lngOffset, this.props.offset)

        this.map.setView(latlng);
        console.log('Setting location    state');
    }

    }

    componentDidMount() {
        console.log('Component mounted to DOM');

        if (!this.map) {
            console.log('Initializing map');
            console.log(this.props);
            this.map =  L.map('map').setView([this.props.locationState.coords.latitude, this.props.locationState.coords.longitude], 13)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

            const redIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            const blueIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            console.log('Props', this.props);

            console.log('Location Prop', this.props.locationState)
            console.log('Moveable Prop', this.props.moveable_location)

            console.log('Location Prop', this.props.locationState.coords)
            console.log('Moveable Prop', this.props.moveable_location.coords)

            this.fixed_marker = L.marker([this.props.locationState.coords.latitude, this.props.locationState.coords.longitude], {icon: blueIcon});
            this.map.addLayer(this.fixed_marker);
            
            let finish_true
            if (this.props.finish){
                finish_true = false;
                console.log('Going to draw path');
                this.drawPath(this.props.paths.moveablePath);
            } else {
                finish_true = true;
            }
    
            this.moveable_marker = L.marker([this.props.moveable_location.coords.latitude, this.props.moveable_location.coords.longitude], {icon: redIcon, draggable: finish_true});
            this.map.addLayer(this.moveable_marker);

        }
        else {
            console.log('Map already initialized');
        }
    }

    updateLocation = (position) => {
        console.log('Updating location');
        const latlng = L.latLng(position.coords.latitude, position.coords.longitude);
        this.fixed_marker.setLatLng(latlng);
        if (!this.moveable_marker_set) {
            console.log('Setting moveable marker');

            const moveable_marker_latlng = L.latLng(position.coords.latitude-0.001, position.coords.longitude+0.001);
            this.moveable_marker.setLatLng(moveable_marker_latlng);
            // this.props.setMoveableMarker(true, [moveable_marker_latlng.lat, moveable_marker_latlng.lng]);
            this.moveable_marker_set = true;
            
        }
        this.map.setView(latlng);
    }

    drawPath = (path_selected) => {
 
        console.log('Drawing path', path_selected);


        if (path_selected.length === 0) {
            console.log('No path to draw');
            return;
        }
        // Map path_selected to an array of locations
        const locations = path_selected.map(coords => coords.location);

        console.log(locations);
    
        const polyline = L.polyline(locations, {color: 'red'}).addTo(this.map);
        this.map.fitBounds(polyline.getBounds());
        
        console.log('Path drawn');


    };

    resetMap = () => {
        console.log('Resetting map');
        if (this.map){
            this.map.setView([0, 0], 13);
            this.moveable_marker.setLatLng([0, 0]);
            this.fixed_marker.setLatLng([0, 0]);
            //clear polyline
            this.map.eachLayer(function (layer) {
                if (layer instanceof L.Polyline) {
                    layer.remove();
                }
            });
            console.log('Map reset');
        }
        else {
            console.log('Map not initialized');
        }
    }

    getMap = () => {
        return this.map;
    }

    getFixedMarker = () => {
        return this.fixed_marker;
    }

    getMoveableMarker = () => {
        return this.moveable_marker;
    }

    setMoveableMarkerSet = (callback) => {
        console.log('Moveable marker set inside here now!');
        const latOffset = this.moveable_marker.getLatLng().lat - this.fixed_marker.getLatLng().lat;
        const lngOffset = this.moveable_marker.getLatLng().lng - this.fixed_marker.getLatLng().lng;
        this.setState({ latOffset, lngOffset }, () => {
            console.log('Moveable marker set inside map.js:', this.state.latOffset, this.state.lngOffset);
            this.props.onOffsetChange({ latOffset: this.state.latOffset, lngOffset: this.state.lngOffset });
            if (callback) callback();
        });
    }

    getOffset = () => {
        return { latOffset: this.state.latOffset, lngOffset: this.state.lngOffset };
    }

    render() {

        // const mapStyle = this.props.small ? {width: '35vw', height: '25vh' } : { width: '70vw', height: '50vh'};

        // Conditionally render the JSX based on this.props.map_background
        if (this.props.map_background) {
            return (
   
                    <div id='map' className='mapBackground'></div>

            );
        } else {
            if (this.props.small){
                return (
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <div id="map" style={{width: '35vw', height: '25vh'}}></div>
                    </div>
                );
            } else {
                return (
                    <div id="mapparent">
                        <div id="map"></div>
                    </div>
                );
            }
        }
        // return (

        //     mapDiv

        // );
    }
}

export default Map;

