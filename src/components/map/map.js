import React from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, Polyline, Circle } from '@react-google-maps/api';
import { getMobi } from '../../utils';
import StreetView from './streetview';
import { computeHeading } from 'spherical-geometry-js';

const INITIAL_CENTER = { lat: 49.2577143, lng: -123.1939432 };

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobiBikes: [],
      positions: [
        { lat: 49.225769, lng: -123.077244 },
        { lat: 49.226604, lng: -123.077339 },
        { lat: 49.227502, lng: -123.077307 },
        { lat: 49.2276733, lng: -123.0769295 },
        { lat: 49.2276835, lng: -123.0765166 },
      ],
      current_position: 0,
      center: INITIAL_CENTER,
      streetViewVisibility: false,
      streetViewHeading: 0,
    };
    this.mapRef;
  }

  componentDidMount() {
    const initialHeading = computeHeading(this.state.positions[0], this.state.positions[1]);
    console.log('initialHeading', initialHeading);
    this.setState((prevState) => {
      return { ...prevState, streetViewHeading: initialHeading };
    });
  }

  nextStreetViewPosition() {
    console.log('state', this.state);

    const newPosition =
      this.state.current_position + 1 > this.state.positions.length
        ? this.state.positions.length
        : this.state.current_position + 1;

    let newHeading =
      newPosition === this.state.current_position
        ? this.state.streetViewHeading
        : computeHeading(this.state.positions[this.state.current_position], this.state.positions[newPosition]);

    console.log('newHeading', newHeading);
    this.setState((prevState) => {
      return { ...prevState, current_position: newPosition, streetViewHeading: newHeading };
    });
    console.log('newHeading state', this.state);
  }

  prevStreetViewPosition() {
    console.log('state', this.state);
    let newPosition = this.state.current_position - 1 < 0 ? 0 : this.state.current_position - 1;
    this.setState((prevState) => {
      return { ...prevState, current_position: prevState.current_position - 1 };
    });
  }

  toggleStreetView() {
    let newVisibility = !this.state.streetViewVisibility;
    this.setState((prevState) => {
      return { ...prevState, streetViewVisibility: newVisibility };
    });
  }

  componentDidMount() {
    getMobi((result) => {
      console.log(result);
      this.setState({
        mobiBikes: result,
      });
    });
  }

  handleClick(e) {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const { placeA } = this.props;
    if (Object.keys(placeA).length !== 3) {
      this.props.setPlaceA({ name: `${lat.toFixed(3)}, ${lng.toFixed(3)}`, lat, lng });
    } else {
      this.props.setPlaceB({ name: `${lat.toFixed(3)}, ${lng.toFixed(3)}`, lat, lng });
    }
  }

  render() {
    const { mobiBikes } = this.state;
    const { placeA, placeB, style, fastestRoute } = this.props;
    return (
      <div>
        <button onClick={this.nextStreetViewPosition.bind(this)}>Next</button>
        <button onClick={this.prevStreetViewPosition.bind(this)}>Prev</button>
        <button onClick={this.toggleStreetView.bind(this)}>Street View</button>
        <GoogleMap
          id="map"
          mapContainerStyle={style}
          center={INITIAL_CENTER}
          zoom={12}
          onClick={this.handleClick.bind(this)}
          onLoad={(ref) => {
            this.mapRef = ref;
          }}
        >
          {placeA.lat && <Marker position={placeA} />}
          {placeB.lat && <Marker position={placeB} />}
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
                />
              );
            })}
          {mobiBikes &&
            mobiBikes.map((station, i) => {
              const { geopoint } = station;
              if (!geopoint) return;
              const loc = {
                lat: geopoint[0],
                lng: geopoint[1],
              };
              return <Circle key={i} center={loc} radius={100} />;
            })}
          <StreetView
            currentPosition={this.state.current_position}
            positions={this.state.positions}
            visbility={this.state.streetViewVisibility}
            heading={this.state.streetViewHeading}
          />
        </GoogleMap>
      </div>
    );
  }
}

Map.propTypes = {
  placeA: PropTypes.shape({}).isRequired,
  placeB: PropTypes.shape({}).isRequired,
  setPlaceA: PropTypes.func.isRequired,
  setPlaceB: PropTypes.func.isRequired,
  fastestRoute: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
