import React, { useState, useRef } from 'react';
import { StreetViewPanorama } from '@react-google-maps/api';

function StreetView(props) {
  return (
    <StreetViewPanorama
      pov={props.positions[props.currentPosition].pov}
      position={props.positions[props.currentPosition]}
      visible={props.visbility}
      motionTracking={true}
    />
  );
}

export default StreetView;
