import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Button } from '@material-ui/core';

import AutoCompleteInput from '../components/autocomplete';
import Map from '../components/map/map';
import { getEfficientPath } from '../utils';

const classes = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    backgroundColor: 'black',
    width: '200px',
    height: '200px',
  },
  inputs: {
    zIndex: 13,
  },
  map: {
    position: 'absolute',
    zIndex: 10,
    height: '100vh',
    width: '100vw',
  },
  modal: {
    position: 'absolute',
  },
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
    <div>
      <Head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"></link>
        <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.4/build/pannellum.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.4/build/pannellum.css"></link>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdgZKoxkdZjb92G7aMvEiJYiegd9n6rbA&libraries=places"></script>
      </Head>
      <div style={classes.page}>
        {!toggleMap && (<div style={classes.logo} />)}

        <div style={classes.inputs}>
          <AutoCompleteInput
            value={placeA}
            handleChange={setPlaceA}
          />
          <AutoCompleteInput
            value={placeB}
            handleChange={setPlaceB}
          />
        </div>

        {!toggleMap && (
          <Button
            onClick={() => setToggleMap(!toggleMap)}
          >
            Click to view map
          </Button>
        )}
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
            Loading
          </div>
        )}
      </div>
    </div>
  );
}
