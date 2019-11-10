import React, { useState, useRef } from 'react';
import { StreetViewPanorama } from '@react-google-maps/api';

function StreetView(props) {
  return (
    <StreetViewPanorama
      pov={{ heading: props.heading, pitch: 0 }}
      position={props.positions[props.currentPosition]}
      visible={props.visbility}
      motionTracking={true}
      options={{ clickToGo: false, disableDefaultUI: true }}
    />
  );
}

export default StreetView;
