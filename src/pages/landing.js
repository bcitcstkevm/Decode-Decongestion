import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
};

export default function LandingPage({
  placeA, placeB, setPlaceA, setPlaceB, finishFetch, changePage, setFastestRoute,
}) {
  const [toggleMap, setToggleMap] = useState(false);

  useEffect(() => {
    if (Object.keys(placeA).length === 3 && Object.keys(placeB).length === 3) {
      changePage();
      getEfficientPath(finishFetch, setFastestRoute);
    }
  }, [placeA, placeB]);

  return (
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
        />
      )}

    </div>
  );
}

LandingPage.propTypes = {
  placeA: PropTypes.shape({}).isRequired,
  placeB: PropTypes.shape({}).isRequired,
  setPlaceA: PropTypes.func.isRequired,
  setPlaceB: PropTypes.func.isRequired,
  finishFetch: PropTypes.func.isRequired,
  changePage: PropTypes.func.isRequired,
  setFastestRoute: PropTypes.func.isRequired,
};
