import React from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api';

const INITIAL_CENTER = { lat: 49.2577143, lng: -123.1939432 };

const containerStyle = {
  position: 'absolute', 
  right: 0, 
  backgroundColor: 'white', 
  zIndex: 10,
  height: '150px',
  width: '150px',
}

export default class Minimap extends React.Component {
  render() {
    const { fastestRoute, currentPosition } = this.props
    const position = fastestRoute[currentPosition]
    console.log(position)
    return <div style={containerStyle}>
      <GoogleMap
        id="minimap"
        mapContainerStyle={{width: '100%', height: '100%'}}
        center={position ? position.start_location : null}
        zoom={15}
        onLoad={(ref) => {
          this.mapRef = ref;
        }}
        options = {{
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false
        }}
      >
        {fastestRoute &&
        fastestRoute.map((line, i) => {
          const { start_location, end_location } = line;
          return (
            <Polyline
              key={i}
              path={[
                { lat: start_location.lat, lng: start_location.lng },
                { lat: end_location.lat, lng: end_location.lng },
              ]}
              options={{
                strokeColor: `rgb(${255 * line.danger}, ${255 * Math.max((1 - line.danger), 0.5)}, 0)`,
              }}
            />
            );
        })}
        {position &&
          <Marker position={position.start_location} />
        }
      </GoogleMap>
    </div>
  }
}

Minimap.propTypes = {
  fastestRoute: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currentPosition: PropTypes.number,
};
