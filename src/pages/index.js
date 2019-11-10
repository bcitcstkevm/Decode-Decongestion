import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { CircularProgress, FormControlLabel, Checkbox } from '@material-ui/core';
import { DirectionsBike, Map } from '@material-ui/icons';

import AutoCompleteInput from '../components/autocomplete';
import MapComp from '../components/map/map';
import { getEfficientPath, getSafest } from '../utils';

const classes = {
  root: {
    height: '100vh',
    maxHeight: '100vh',
    width: '100vw',
  },
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
    // margin: '30%',
    // maxHeight: '100%',
    height: '100%',
    // backgroundImage: `url('${'https://images.pexels.com/photos/1630885/pexels-photo-1630885.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'}')`,
    // transition: 'flex-start 1000ms linear',
  },
  logo: {
    // backgroundColor: 'black',
    width: '200px',
    height: '200px',
    fontSize: '2rem',
    marginBottom: '3rem',
    textAlign: 'center',
    fontFamily: 'Roboto Mono, monospace',
  },
  inputs: {
    zIndex: 13,
    position: 'absolute',
    top: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    // position: 'relative',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    opacity: '60%',
  },
  inputsMoved: {
    zIndex: 13,
    position: 'absolute',
    top: 0,
    left: 'calc(50%-200px)',
    transition: 'top .3s linear',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: '10px',
    border: '1px solid black',
    borderRadius: '10px',
    fontFamily: 'Roboto Mono, monospace',
  },
  streetViewButton: {
    position: 'absolute',
    bottom: 0,
  },
  map: {
    position: 'absolute',
    zIndex: 10,
    height: '100vh',
    width: '100vw',
  },
  modal: {
    position: 'absolute',
    zIndex: 50,
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fefefe',
    margin: 'auto',
    top: '40%',
    padding: '20px',
    borderRadius: '25px',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  checkSafestContainer: {
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
  },
  formControl: {
    margin: 0,
  },
};

export default function Index() {
  const [placeA, setPlaceA] = useState({ name: '' });
  const [placeB, setPlaceB] = useState({ name: '' });
  const [toggleMap, setToggleMap] = useState(false);
  const [checkedSafest, setCheckedSafest] = useState(false);
  const [safestMessage, setSafestMessage] = useState(false);

  const [fetchingData, setFetchingData] = useState(false);
  const [fastestRoute, setFastestRoute] = useState([]);
  const [streetView, setStreetView] = useState(false);

  const checkSafestRoute = () => {
    if (!checkedSafest) {
      setFetchingData(true)
      getSafest(placeA, placeB, result => {
        setFetchingData(false);
        setFastestRoute(result);
      })
    }
    setCheckedSafest(!checkedSafest);
  };

  useEffect(() => {
    if (Object.keys(placeA).length === 3 && Object.keys(placeB).length === 3) {
      setToggleMap(true)
      setFetchingData(true)
      getEfficientPath(placeA, placeB, result => {
        setFetchingData(false)
        setFastestRoute(result.result)
        if (result.length === 1) {
          setSafestMessage(true);
          setCheckedSafest(true);

        }
      })
    }
  }, [placeA, placeB]);

  return (
    <div style={classes.root}>
      <Head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        ></link>
        <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.4/build/pannellum.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.4/build/pannellum.css"></link>
        <script
          type="text/javascript"
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdgZKoxkdZjb92G7aMvEiJYiegd9n6rbA&libraries=geometry,places"
        ></script>
        <link href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap" rel="stylesheet"></link>
      </Head>
      <div style={classes.page}>
        {!toggleMap && (
          <img style={classes.image} src="https://images.pexels.com/photos/1630885/pexels-photo-1630885.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" />
        )}
        {!streetView && (
          <div style={toggleMap ? classes.inputsMoved : classes.inputs}>
            {!toggleMap && (
              <div style={classes.logo}>
                <DirectionsBike style={{ width: 200, height: 200 }} />
                <p>Bike2Go</p>
              </div>
            )}

            <AutoCompleteInput
              value={placeA}
              handleChange={setPlaceA}
              style={classes.textInput}
              placeholder="Enter origin"
              clearRoute={() => setFastestRoute([])}
            />
            <AutoCompleteInput
              value={placeB}
              handleChange={setPlaceB}
              style={classes.textInput}
              placeholder="Enter destination"
              clearRoute={() => setFastestRoute([])}
            />

            {toggleMap && Boolean(fastestRoute.length) && (
              <div style={classes.checkSafestContainer}>
                <FormControlLabel
                  style={classes.formControl}
                  control={(
                    <Checkbox
                      checked={checkedSafest}
                      onChange={checkSafestRoute}
                      value={checkedSafest}
                      color="primary"
                    />
                  )}
                  label="Safest Route?"
                />
              </div>
            )}

            {!toggleMap && (
              <button
                type="button"
                style={classes.button}
                onClick={() => setToggleMap(!toggleMap)}
              >
                Select Location from Map
                <Map />
              </button>
            )}
          </div>
        )}

        {toggleMap && (
          <MapComp
            style={classes.map}
            placeA={placeA}
            placeB={placeB}
            setPlaceA={setPlaceA}
            setPlaceB={setPlaceB}
            fastestRoute={fastestRoute}
            streetView={streetView}
            handleStreetView={setStreetView}
          />
        )}

        {fetchingData && (
          <div style={classes.modal}>
            <div style={classes.modalContent}>
              <p>Calculating...</p>
              <CircularProgress />
            </div>
          </div>
        )}
        {safestMessage && (
          <div aria-hidden="true" style={classes.modal} onClick={() => setSafestMessage(false)}>
            <div style={classes.modalContent}>
              <p>This is the safest route!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
