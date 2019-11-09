import React, { useState } from 'react';
import Head from 'next/head';

import LandingPage from './landing';

const PAGE_STATES = {
  LANDING: 'landing',
  LOADING: 'loading',
  RESULTS: 'results',
  SIMULATION: 'simulation',
};

export default function Index() {

  const [placeA, setPlaceA] = useState({ name: '' });
  const [placeB, setPlaceB] = useState({ name: '' });
  const [pageState, setPageState] = useState(PAGE_STATES.LANDING);

  const [toggleMap, setToggleMap] = useState(false);

  return (
    <div>
      <Head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"></link>
        <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.4/build/pannellum.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.4/build/pannellum.css"></link>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdgZKoxkdZjb92G7aMvEiJYiegd9n6rbA&libraries=places"></script>
      </Head>
      {{
        [PAGE_STATES.LANDING]: <LandingPage
          placeA={placeA}
          placeB={placeB}
          setPlaceA={setPlaceA}
          setPlaceB={setPlaceB}
        />,
      }[pageState]}
    </div>
  );
}
