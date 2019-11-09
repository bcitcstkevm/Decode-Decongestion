import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Button, TextField, makeStyles } from '@material-ui/core';

import AutoCompleteInput from '../components/autocomplete';
import { displayPano } from '../scripts/pannellum';
import Map from '../components/map/map'

const Root = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
`;

const useStyles = makeStyles({
  textField: {
    width: '50%',
  },
});

export default function Index() {
  const classes = useStyles();

  const [placeA, setPlaceA] = useState({});
  const [placeB, setPlaceB] = useState({});

  return (
    <Root>
      <Head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"></link>
        <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.4/build/pannellum.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.4/build/pannellum.css"></link>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdgZKoxkdZjb92G7aMvEiJYiegd9n6rbA&libraries=places"></script>
      </Head>
      <h2>Header</h2>
      <AutoCompleteInput
        value={placeA}
        handleChange={setPlaceA}
      />
      <AutoCompleteInput
        value={placeB}
        handleChange={setPlaceB}
      />
      <p>Click here to select from map</p>
      <Map
        placeA={placeA}
        placeB={placeB}
        setPlaceA={setPlaceA}
        setPlaceB={setPlaceB}
      />
    </Root>
  );
}
