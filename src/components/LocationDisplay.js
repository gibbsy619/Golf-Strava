import React, { Component } from 'react';

class LocationDisplay extends Component {
    render() {
        return (
            <div>
                <h2>Current Location</h2>
                <p>Latitude: {this.props.latitude}</p>
                <p>Longitude: {this.props.longitude}</p>
                {/* Display other related information here */}
            </div>
        );
    }
}

export default LocationDisplay;