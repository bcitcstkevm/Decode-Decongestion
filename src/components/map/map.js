import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types'
import { GoogleMap, Marker } from '@react-google-maps/api'

const mapContainerStyle = {
  height: '500px', // TODO: fix this
  width: '100%'
}

const INITIAL_CENTER = {lat: 49.2577143, lng: -123.1939432}

export default class Map extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      center: INITIAL_CENTER
    }
    this.mapRef
  }

  handleClick(e) {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    this.props.setPlaceA({lat, lng})
  }

  render(){
    const {  } = this.state
    const { placeA } = this.props
    return (
      <GoogleMap
        id='map'
        mapContainerStyle={mapContainerStyle}
        center={INITIAL_CENTER}
        zoom={12}
        onClick={this.handleClick.bind(this)}
        onLoad={ref => {
          this.mapRef = ref
        }}
      >
        {placeA && <Marker
          position={placeA}
        />}
      </GoogleMap>
      )
  }
}

Map.propTypes = {
  placeA: PropTypes.object,
  placeB: PropTypes.object,
  setPlaceA: PropTypes.func.isRequired,
  setPlaceB: PropTypes.func.isRequired,
}