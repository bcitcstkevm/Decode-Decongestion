import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { CircularProgress } from '@material-ui/core';

import AutoCompleteInput from '../components/autocomplete';
import Map from '../components/map/map';
import { getEfficientPath } from '../utils';

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
    // transition: 'flex-start 1000ms linear',
  },
  logo: {
    backgroundColor: 'black',
    width: '200px',
    height: '200px',
  },
  inputs: {
    zIndex: 13,
    position: 'absolute',
    top: '30%',
  },
  inputsMoved: {
    zIndex: 13,
    position: 'absolute',
    top: 0,
    left: 'calc(50%-200px)',
    transition: 'top .3s linear',
  },
  button: {
    backgroundColor: '#fff',
  },
  streetViewButton: {
    position: 'absolute',
    bottom: 0,
  },
  textInput: {
    borderRadius: 5,
    border: '1px solid #000',
    marginBottom: 5,
    marginTop: 5,
    paddingLeft: 5,
    width: '200px ',
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
  }
};

export default function Index() {
  const [placeA, setPlaceA] = useState({ name: '' });
  const [placeB, setPlaceB] = useState({ name: '' });
  const [toggleMap, setToggleMap] = useState(false);

  const [fetchingData, setFetchingData] = useState(false);
  const [fastestRoute, setFastestRoute] = useState([]);

  useEffect(() => {
    if (Object.keys(placeA).length === 3 && Object.keys(placeB).length === 3) {
      setToggleMap(true)
      setFetchingData(true)
      getEfficientPath(placeA, placeB, result => {
        setFetchingData(false)
        setFastestRoute(result)
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
      </Head>
      <div style={classes.page}>
        <div style={toggleMap ? classes.inputsMoved : classes.inputs}>
          {!toggleMap && (<div style={classes.logo} />)}
          <AutoCompleteInput
            value={placeA}
            handleChange={setPlaceA}
            style={classes.textInput}
          />
          <AutoCompleteInput
            value={placeB}
            handleChange={setPlaceB}
            style={classes.textInput}
          />

          {!toggleMap && (
            <button
              type="button"
              style={classes.button}
              onClick={() => setToggleMap(!toggleMap)}
            >
              Select Location from Map
            </button>
          )}
        </div>

        {toggleMap && (
          <Map
            style={classes.map}
            placeA={placeA}
            placeB={placeB}
            setPlaceA={setPlaceA}
            setPlaceB={setPlaceB}
            fastestRoute={fastestRoute}
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
      </div>
    </div>
  );
}
