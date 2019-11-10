/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, Polyline, Circle, InfoWindow } from '@react-google-maps/api';
import { getMobi } from '../../utils';
import StreetView from './streetview';
import { computeHeading, interpolate, LatLng } from 'spherical-geometry-js';
import { IconButton, Button } from '@material-ui/core';
import {
  ChevronLeft, ChevronRight, Accessibility, Map, Pause, PlayArrow,
} from '@material-ui/icons';
import Minimap from './minimap'

const INITIAL_CENTER = { lat: 49.260981, lng: -123.114354 };

const classes = {
  streetViewButton: {
    position: 'absolute',
    bottom: '12px',
    zIndex: 20,
    width: '200px',
    left: '50%',
    marginLeft: '-100px',
    backgroundColor: '#fff',
    border: '1px solid black',
    borderRadius: '10px',
    display: 'flex',
    fontFamily: 'Roboto Mono, monospace',
    textTransform: 'capitalize',
  },
  previousButton: {
    position: 'absolute',
    zIndex: 20,
    top: '50%',
    left: '10px',
    backgroundColor: '#fff',
  },
  nextButton: {
    position: 'absolute',
    zIndex: 20,
    top: '50%',
    right: '10px',
    backgroundColor: '#fff',
  },
  mobiIcon: {
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 11,
    // top: 0,
    borderRadius: 100,
    width: '17vw',
    height: '17vw',
    border: '1px solid black',
  },
  desktopMobi: {
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 11,
    // top: 0,
    borderRadius: 100,
    width: '100px',
    height: '100px',
    border: '1px solid black',
  },
  mobiEnable: {
    opacity: 100,
  },
  mobiDisable: {
    opacity: 50,
  },
  overlayDesktop: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    zIndex: 11,
    left: '50%',
    marginLeft: '-100px',
  },
  overlayMobile: {
    position: 'absolute',
    width: '20vw',
    zIndex: 11,
    left: '50%',
    marginLeft: '-20vw',
  },
  pausePlay: {
    backgroundColor: '#fff',
    border: '1px solid black',
    borderRadius: '25px',
    position: 'absolute',
    zIndex: 11,
    bottom: '75px',
    left: '50%',
    marginLeft: '-50px',
    width: '100px',
  },
  inPlay: {
    color: 'rgb(0, 0, 0, 1)',
  },
};

export default class GoogleMapComp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobiBikes: [],
      positions: [
        { lat: 49.225769, lng: -123.077244, heading: 0 },
        { lat: 49.226604, lng: -123.077339, heading: 0 },
        { lat: 49.227502, lng: -123.077307, heading: 0 },
        { lat: 49.2276733, lng: -123.0769295, heading: 0 },
        { lat: 49.2276835, lng: -123.0765166, heading: 0 },
      ],
      current_position: 0,
      center: INITIAL_CENTER,
      mobiEnable: true,
      infoBox: null,
      mq: window.matchMedia( "(max-width: 570px)" ).matches,
      isAutoplay: false,
    };
    this.mapRef;
    this.timerRef;
  }

  componentDidMount() {
    getMobi((result) => {
      this.setState({
        mobiBikes: result,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.fastestRoute &&
      prevProps.fastestRoute &&
      JSON.stringify(prevProps.fastestRoute) !== JSON.stringify(this.props.fastestRoute)
    ) {
      this.parseCoord(this.props.fastestRoute);
    }

    if ((prevState.isAutoplay && !this.state.isAutoplay) || this.state.current_position === this.state.positions.length-1) {
      if (this.timerRef) {
        clearInterval(this.timerRef)
      }
    } else if (!prevState.isAutoplay && this.state.isAutoplay) {
      this.timerRef = setInterval(() => {
        this.nextStreetViewPosition()
      }, 3000)
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
    const { streetView, handleStreetView } = this.props;
    if (streetView) {
      this.setState({ isAutoplay: false })
    }
    handleStreetView(!streetView);
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

  // interpolatepoints(data, fraction) {
  //   let newarray = [];
  //   let i = 0;
  //   for (i = 0; i < data.length - 1; i++) {
  //     newarray.push(data[i]);
  //     for (let j = 1; j < 10; j++) {
  //       let origin = new LatLng(data[i].lat, data[i].lng);
  //       let destination = new LatLng(data[i + 1].lat, data[i + 1].lng);
  //       let point = interpolate(origin, destination, fraction * j);
  //       newarray.push({ lat: point.latitude, lng: point.longitude });
  //     }
  //   }
  //   return newarray;
  // }

  parseCoord(data) {
    let i = 0;
    let route = [];
    if (data && data.length > 1) {
      for (i = 0; i < data.length - 1; i++) {
        route.push(data[i].start_location);
      }
      route.push(data[i].end_location);
      // route = this.interpolatepoints(route, 0.1);
      for (i = 0; i < route.length - 1; i++) {
        const heading = computeHeading(route[i], route[i + 1]);
        route[i]['heading'] = heading;
      }
      route[i]['heading'] = route[i - 1]['heading'];
      this.setState({ positions: route });
      console.log('route: ', route);
    }
  }

  handleMobiEnable() {
    const { mobiEnable } = this.state;
    this.setState({
      mobiEnable: !mobiEnable,
    });
  };

  handleAutoPlay() {
    this.setState({ isAutoplay: !this.state.isAutoplay })
  }

  render() {
    const { mobiBikes, infoBox, current_position, mobiEnable, mq, isAutoplay } = this.state;
    const { placeA, placeB, style, fastestRoute, streetView } = this.props;
    return (
      <div style={style}>
        
        {streetView && (
          <>
            <div
              style={mq ? {
                backgroundColor: `rgba(${255 * fastestRoute[current_position].danger},${255 * Math.max((1 - fastestRoute[current_position].danger), 0.5)},0, ${0.5 + Math.min(0.4, fastestRoute[current_position].danger)})`,
                position: 'absolute',
                width: '55vw',
                zIndex: 11,
                left: '50%',
                marginLeft: '-45vw',
                borderRadius: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '10px',
                fontFamily: 'Roboto Mono, monospace',
              } : {
                backgroundColor: `rgba(${255 * fastestRoute[current_position].danger},${255 * Math.max((1 - fastestRoute[current_position].danger), 0.5)},0, ${0.5 + Math.min(0.4, fastestRoute[current_position].danger)})`,
                position: 'absolute',
                width: '200px',
                height: '100px',
                zIndex: 11,
                left: '50%',
                marginLeft: '-100px',
                borderRadius: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '10px',
                fontFamily: 'Roboto Mono, monospace',
              }}
            >
              <p style={{ marginBottom: 0}}>Danger Level: {fastestRoute[current_position].danger < 0.33 ? 'Low' : (fastestRoute[current_position].danger < 0.66 ? 'Medium' : 'High')}</p>
              <p style={{ marginBottom: 0}}>{fastestRoute[current_position].danger < 0.33 ? 'Enjoy!' : (fastestRoute[current_position].danger < 0.66 ? 'Caution!' : 'Be careful!!')}</p>
            </div>
            <IconButton
              style={classes.nextButton}
              onClick={this.nextStreetViewPosition.bind(this)}
              disabled={current_position >= fastestRoute.length - 1}
            >
              <ChevronRight />
            </IconButton>
            <IconButton
              style={classes.previousButton}
              onClick={this.prevStreetViewPosition.bind(this)}
              disabled={current_position <= 0}
            >
              <ChevronLeft />
            </IconButton>
            {isAutoplay ? (
              <button
                onClick={this.handleAutoPlay.bind(this)}
                style={classes.pausePlay}
              >
                <Pause style={classes.inPlay} />
              </button>
              
            ) : (
              <button
                onClick={this.handleAutoPlay.bind(this)}
                style={classes.pausePlay}
              >
                <PlayArrow style={classes.inPlay} />
              </button>
            )}
          </>
        )}
        
        {!streetView && (
          <div className={mobiEnable ? classes.mobiEnable : classes.mobiDisable} onClick={this.handleMobiEnable.bind(this)}>
            <img style={mq ? classes.mobiIcon : classes.desktopMobi} src="https://www.mobibikes.ca/sites/all/themes/smoove_bootstrap/images/icon_guidon_ride.svg" />
          </div>
        )}
        {Boolean(fastestRoute.length) && (
          <Button
            type="button"
            style={classes.streetViewButton}
            onClick={this.toggleStreetView.bind(this)}
          >
            {
              streetView
                ? (
                  <div>
                    <Map />
                    <span>Map View</span>
                  </div>
                )
                : (
                  <div>
                    <Accessibility />
                    <span>Simulate Route</span>
                  </div>
                )
            }
          </Button>
        )}
        <GoogleMap
          id="map"
          mapContainerStyle={style}
          center={INITIAL_CENTER}
          zoom={13}
          onClick={this.handleClick.bind(this)}
          onLoad={(ref) => {
            this.mapRef = ref;
          }}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: false,
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
                    strokeColor: `rgb(${255 * line.danger}, ${255 * Math.max((1 - line.danger), 0.5)}, 0)`,
                  }}
                />
              );
            })}
          {mobiEnable && mobiBikes &&
            mobiBikes.map((station, i) => {
              const { geopoint } = station;
              if (!geopoint) return;
              const loc = {
                lat: geopoint[0],
                lng: geopoint[1],
              };
              return (
                <Circle
                  key={i}
                  center={loc}
                  radius={10}
                  options={{
                    strokeColor: 'rgb(0,169,221)',
                  }}
                />
              );
            })}
          {infoBox && (
            <InfoWindow
              position={{ lat: infoBox.lat, lng: infoBox.lng }}
              onCloseClick={() => this.setState({ infoBox: null })}
            >
              <div style={{
                backgroundColor: `rgb(${255 * infoBox.line.danger}, ${255 * Math.max((1 - infoBox.line.danger), 0.5)}, 0)`,
                opacity: 0.75,
                padding: 12,
                fontSize: 16,
                fontColor: `#08233B`,
                display: 'flex',
                flexDirection: 'column',
                
              }}>
                <span>Bike Collisions: {infoBox.line.bikeCollisions}</span>
                <span>Fatalities: {infoBox.line.fatalities}</span>
              </div>
            </InfoWindow>
          )}
          <StreetView
            currentPosition={this.state.current_position}
            positions={this.state.positions}
            visbility={streetView}
            heading={this.state.streetViewHeading}
          />
        </GoogleMap>
        {streetView && <Minimap 
          fastestRoute={fastestRoute}
          currentPosition={this.state.current_position}
        />}
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
