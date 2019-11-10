import React from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, Polyline, Circle, InfoWindow } from '@react-google-maps/api';
import { getMobi } from '../../utils';
import StreetView from './streetview';
import { computeHeading } from 'spherical-geometry-js';

const INITIAL_CENTER = { lat: 49.2577143, lng: -123.1939432 };

const classes = {
  streetViewButton: {
    position: 'absolute',
    bottom: '12px',
    zIndex: 20,
    width: '100px',
    left: '50%',
    marginLeft: '-50px',
    backgroundColor: '#fff',
    border: '1px solid black',
    borderRadius: '10px',
  },
  previousButton: {
    position: 'absolute',
    zIndex: 20,
    top: '50%',
    left: '0px',
  },
  nextButton: {
    position: 'absolute',
    zIndex: 20,
    top: '50%',
    right: '0px',
  },
};

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
      infoBox: null,
    };
    this.mapRef;
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.fastestRoute &&
      prevProps &&
      JSON.stringify(prevProps.fastestRoute) !== JSON.stringify(this.props.fastestRoute)
    ) {
      this.parseCoord(this.props.fastestRoute);
    }
  }

  nextStreetViewPosition() {
    console.log('state', this.state);

    const newPosition =
      this.state.current_position + 1 > this.state.positions.length - 1
        ? this.state.positions.length - 1
        : this.state.current_position + 1;

    this.setState((prevState) => {
      return {
        ...prevState,
        current_position: newPosition,
      };
    });
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
      this.setState({
        mobiBikes: result,
      });
    });
  }

  handleClick(e) {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const { placeA, placeB } = this.props;
    this.setState({ infoBox: null });
    if (Object.keys(placeA).length === 3 && Object.keys(placeB).length === 3) {
      return;
    }

    if (Object.keys(placeA).length !== 3) {
      this.props.setPlaceA({ name: `${lat.toFixed(3)}, ${lng.toFixed(3)}`, lat, lng });
    } else {
      this.props.setPlaceB({ name: `${lat.toFixed(3)}, ${lng.toFixed(3)}`, lat, lng });
    }
  }

  handleLineClick(e, line) {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    this.setState({
      infoBox: {
        lat,
        lng,
        line,
      },
    });
    console.log(line);
  }

  parseCoord(data) {
    let i;
    let route = [];
    if (data && data.length > 0) {
      for (i = 0; i < data.length - 1; i++) {
        route.push(data[i].start_location);
      }
      route.push(data[i].end_location);

      for (i = 0; i < route.length - 1; i++) {
        const heading = computeHeading(route[i], route[i + 1]);
        route[i]['heading'] = heading;
      }
      route[i]['heading'] = route[i - 1]['heading'];
      this.setState({ positions: route });
      console.log('route: ', route);
    }
  }

  render() {
    const { mobiBikes, infoBox, streetViewVisibility } = this.state;
    const { placeA, placeB, style, fastestRoute } = this.props;
    // console.log('fastestRoute', fastestRoute);
    // this.parseCoord(fastestRoute);
    return (
      <div style={style}>
        {streetViewVisibility && (
          <>
            <button style={classes.nextButton} onClick={this.nextStreetViewPosition.bind(this)}>
              Next
            </button>
            <button style={classes.previousButton} onClick={this.prevStreetViewPosition.bind(this)}>
              Prev
            </button>
          </>
        )}

        {Boolean(fastestRoute.length) && (
          <button type="button" style={classes.streetViewButton} onClick={this.toggleStreetView.bind(this)}>
            Street View
          </button>
        )}
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
                  onClick={(e) => this.handleLineClick(e, line)}
                  options={{
                    strokeColor: `rgb(${255 * line.danger}, ${255 * (1 - line.danger)}, 0)`,
                  }}
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
          {infoBox && (
            <InfoWindow
              position={{ lat: infoBox.lat, lng: infoBox.lng }}
              onCloseClick={() => this.setState({ infoBox: null })}
            >
              <div style={{ backgroundColor: 'yellow', opacity: 0.75, padding: 12 }}>
                <div style={{ fontSize: 16, fontColor: `#08233B` }}>
                  <span>Bike Collisions: {infoBox.line.bikeCollisions}</span>
                  <span>Fatalities: {infoBox.line.fatalities}</span>
                </div>
              </div>
            </InfoWindow>
          )}
          <StreetView
            currentPosition={this.state.current_position}
            positions={this.state.positions}
            visbility={this.state.streetViewVisibility}
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
