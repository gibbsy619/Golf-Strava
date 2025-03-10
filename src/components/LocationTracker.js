import React, { Component } from 'react';

class LocationTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            watchId: null,
            moveable_marker_set: false,
            latitude: 0,
            longitude: 0,
            geo_location: 0,
            global_moveable_marker_latlang: 0,
        };
    }

    getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                this.setState({ latitude, longitude });
                this.props.updateLocation(position);
            }, this.handleLocationError);
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false);
        }
    }

    startRecording = () => {
        if (navigator.geolocation) {
            let watchId = navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                this.setState({ latitude, longitude });
                this.props.updateLocation(position);
            }, this.handleLocationError);
            this.setState({ watchId });
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false);
        }
    }

    stopRecording = () => {
        if (this.state.watchId !== null) {
            navigator.geolocation.clearWatch(this.state.watchId);
            this.setState({ watchId: null });
        }
    }

    confirmLocation = () => {
        // Confirm location logic here
    }

    handleLocationError = (error) => {
        console.log(
            error
                ? 'Error: The Geolocation service failed.'
                : 'Error: Your browser doesn\'t support geolocation.'
        );
    }

    render() {
        // Render logic here
        return (
            <div>
                <button onClick={this.startRecording}>Start Recording</button>
                <button onClick={this.stopRecording}>Stop Recording</button>
                <button onClick={this.confirmLocation}>Confirm Location</button>
            </div>
        );
    }
}

export default LocationTracker;