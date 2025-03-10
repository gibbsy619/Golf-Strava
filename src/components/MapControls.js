import React, { Component } from 'react';

class MapControls extends Component {
    render() {
        return (
            <div>
                <button onClick={this.props.startRecording}>Start Recording</button>
                <button onClick={this.props.stopRecording}>Stop Recording</button>
                <button onClick={this.props.drawPath}>Draw Path</button>
                <button onClick={this.props.confirmLocation}>Confirm Location</button>
                <button onClick={this.props.resetMap}>Reset Map</button>
            </div>
        );
    }
}

export default MapControls;